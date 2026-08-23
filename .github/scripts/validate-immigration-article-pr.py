#!/usr/bin/env python3
"""Trusted quality and provenance gate for a four-locale article PR."""

from __future__ import annotations

import hashlib
import html
import json
import pathlib
import re
import struct
import subprocess
import sys
from urllib.parse import urlparse


LOCALES = {"": "he", "en/": "en", "ru/": "ru", "ua/": "uk"}
SAFE_IMAGE_HOSTS = {
    "images.unsplash.com",
    "unsplash.com",
    "www.pexels.com",
    "images.pexels.com",
}
FORBIDDEN = {
    "he": (
        "הבנת תהליך immigration law",
        "לסיכום, אין להקל ראש בחשיבות ההכנה",
        "בעזרת תכנון מקדים נכון, ניתן לעבור את התהליך בשלום",
        "להבטיח תהליך חלק ומהיר",
        "סירוב בלתי הפיך",
    ),
    "en": (
        "in conclusion, the importance of preparing",
        "with proper advance planning, the process can be completed successfully",
        "guarantee a smooth and fast process",
    ),
    "ru": ("immigration law", "гарантировать быстрый и беспроблемный"),
    "uk": ("immigration law", "relevant", "рекомендуется", "гарантувати швидкий"),
}


def fail(errors: list[str]) -> int:
    if errors:
        print("Article quality gate failed:\n- " + "\n- ".join(errors), file=sys.stderr)
        return 1
    print("Article quality, research, four-locale and image-provenance gates passed.")
    return 0


def exact_field(body: str, label: str) -> str | None:
    match = re.search(rf"(?im)^{re.escape(label)}:\s*([^\r\n]+?)\s*$", body)
    return match.group(1).strip() if match else None


def image_dimensions(data: bytes) -> tuple[int, int]:
    if data.startswith(b"\x89PNG\r\n\x1a\n") and len(data) >= 24:
        return struct.unpack(">II", data[16:24])
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        if data[12:16] == b"VP8X" and len(data) >= 30:
            return (1 + int.from_bytes(data[24:27], "little"), 1 + int.from_bytes(data[27:30], "little"))
    if data.startswith(b"\xff\xd8"):
        index = 2
        while index + 9 < len(data):
            if data[index] != 0xFF:
                index += 1
                continue
            marker = data[index + 1]
            index += 2
            if marker in {0xD8, 0xD9}:
                continue
            length = struct.unpack(">H", data[index:index + 2])[0]
            if marker in {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}:
                height, width = struct.unpack(">HH", data[index + 3:index + 7])
                return width, height
            if length < 2:
                break
            index += length
    raise ValueError("unsupported or malformed image")


def visible_text(fragment: str) -> str:
    fragment = re.sub(r"<(script|style)\b.*?</\1>", " ", fragment, flags=re.I | re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


def main() -> int:
    if len(sys.argv) != 4:
        print("usage: validate-immigration-article-pr.py BASE_SHA HEAD_SHA PR_JSON", file=sys.stderr)
        return 2
    base_sha, head_sha, pr_json = sys.argv[1:]
    pr = json.loads(pathlib.Path(pr_json).read_text(encoding="utf-8"))
    body = pr.get("body") or ""
    errors: list[str] = []

    changed = subprocess.check_output(
        ["git", "diff", "--name-only", base_sha, head_sha], text=True
    ).splitlines()
    article_pattern = re.compile(r"^(?:(en|ru|ua)/)?articles/article-(\d+)\.html$")
    article_matches = [(path, article_pattern.match(path)) for path in changed]
    article_matches = [(path, match) for path, match in article_matches if match]
    ids = {match.group(2) for _, match in article_matches}
    if len(ids) != 1:
        return fail([f"Expected exactly one article ID, found {sorted(ids)}"])
    article_id = next(iter(ids))
    expected_articles = {f"{prefix}articles/article-{article_id}.html" for prefix in LOCALES}
    actual_articles = {path for path, _ in article_matches}
    if actual_articles != expected_articles:
        errors.append(f"Expected four locale files {sorted(expected_articles)}, found {sorted(actual_articles)}")

    image_pattern = re.compile(rf"^images/articles/article-{article_id}\.(?:jpe?g|png|webp)$", re.I)
    image_files = [path for path in changed if image_pattern.fullmatch(path)]
    if len(image_files) != 1:
        errors.append("Exactly one new topic-specific image under images/articles/article-N.* is required")
    allowed = expected_articles | set(image_files) | {"keyword-queue.csv"}
    unexpected = sorted(set(changed) - allowed)
    if unexpected:
        errors.append(f"Forbidden article-run files changed: {unexpected}")

    title = pr.get("title") or ""
    if not re.fullmatch(rf"Publish article-{article_id}: .+", title):
        errors.append(f"PR title must match 'Publish article-{article_id}: <short-intent>'")
    if pr.get("draft") or pr.get("base", {}).get("ref") != "main":
        errors.append("PR must be non-draft and target main")
    if pr.get("head", {}).get("repo", {}).get("full_name") != pr.get("base", {}).get("repo", {}).get("full_name"):
        errors.append("PR head must belong to the same repository")

    research = exact_field(body, "Research Sources")
    source_url = exact_field(body, "Image Source URL")
    license_name = exact_field(body, "Image License")
    expected_sha = exact_field(body, "Image SHA-256")
    declared_dimensions = exact_field(body, "Image Dimensions")
    visual_match = exact_field(body, "Image Visual Match")
    if not research or len(re.findall(r"https://(?:www\.)?gov\.il/\S+", research)) < 2:
        errors.append("PR body requires Research Sources with at least two exact gov.il URLs")
    if not source_url or urlparse(source_url).hostname not in SAFE_IMAGE_HOSTS:
        errors.append("Image Source URL must be an exact Unsplash or Pexels HTTPS page/image URL")
    if license_name not in {"Unsplash License", "Pexels License"}:
        errors.append("Image License must be exactly Unsplash License or Pexels License")
    if not expected_sha or not re.fullmatch(r"[a-f0-9]{64}", expected_sha):
        errors.append("Image SHA-256 must be 64 lowercase hexadecimal characters")
    if not visual_match or len(visual_match) < 40:
        errors.append("Image Visual Match must concretely describe visible pixels and topic relevance")

    expected_web_path = f"/images/articles/{pathlib.Path(image_files[0]).name}" if image_files else ""
    for path in sorted(expected_articles):
        file_path = pathlib.Path(path)
        if not file_path.exists():
            errors.append(f"Missing {path}")
            continue
        raw = file_path.read_text(encoding="utf-8")
        locale = LOCALES[path[: path.index("articles/")]]
        lang = re.search(r"<html[^>]+lang=[\"']([^\"']+)", raw, re.I)
        if not lang or not lang.group(1).lower().startswith(locale):
            errors.append(f"{path}: incorrect or missing html lang for {locale}")
        details = re.search(r'<section id=["\']details["\'][^>]*>(.*?)</section>', raw, re.I | re.S)
        sources = re.search(r'<section id=["\']sources["\'][^>]*>(.*?)</section>', raw, re.I | re.S)
        if not details:
            errors.append(f"{path}: missing details section")
        else:
            text = visible_text(details.group(1))
            count = len(text.split())
            if not 650 <= count <= 1200:
                errors.append(f"{path}: details must contain 650-1200 words, found {count}")
            lowered = text.casefold()
            for phrase in FORBIDDEN[locale]:
                if phrase.casefold() in lowered:
                    errors.append(f"{path}: generic, risky or mixed-language phrase found: {phrase}")
        if not sources:
            errors.append(f"{path}: missing sources section")
        else:
            urls = set(re.findall(r'href=["\'](https://(?:www\.)?gov\.il/[^"\']+)', sources.group(1), re.I))
            if len(urls) < 2:
                errors.append(f"{path}: sources section requires at least two distinct official gov.il URLs")
        image_refs = re.findall(r"(?:src|srcset|content)=[\"']([^\"']*images/articles/[^\"']+)", raw, re.I)
        if expected_web_path and not image_refs:
            errors.append(f"{path}: missing the new article image")
        if expected_web_path and any(ref.split()[0] != expected_web_path for ref in image_refs):
            errors.append(f"{path}: every article image reference must be {expected_web_path}")
        alts = re.findall(r"<img\b[^>]*\balt=[\"']([^\"']+)", raw, re.I)
        if not alts or any(len(visible_text(alt)) < 20 for alt in alts):
            errors.append(f"{path}: image alt text must be concrete and at least 20 characters")

    if image_files:
        data = pathlib.Path(image_files[0]).read_bytes()
        actual_sha = hashlib.sha256(data).hexdigest()
        if expected_sha and actual_sha != expected_sha:
            errors.append(f"Image SHA-256 mismatch: expected {expected_sha}, got {actual_sha}")
        try:
            width, height = image_dimensions(data)
            if width < 1200 or height < 630:
                errors.append(f"Image dimensions must be at least 1200x630, found {width}x{height}")
            if declared_dimensions != f"{width}x{height}":
                errors.append(f"Image Dimensions must be exactly {width}x{height}")
        except ValueError as exc:
            errors.append(f"Image validation failed: {exc}")

    return fail(errors)


if __name__ == "__main__":
    raise SystemExit(main())
