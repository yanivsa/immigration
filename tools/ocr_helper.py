#!/usr/bin/env python3
import argparse
import os
import sys

import google.generativeai as genai
from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract Hebrew text from an image using the Gemini API."
    )
    parser.add_argument("image_path", help="Path to the image file to process.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    image_path = args.image_path

    if not os.path.isfile(image_path):
        print(f"Image not found: {image_path}", file=sys.stderr)
        return 1

    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print(
            "Missing API key. Set GEMINI_API_KEY or GOOGLE_API_KEY in your environment.",
            file=sys.stderr,
        )
        return 1

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    try:
        image = Image.open(image_path)
    except OSError as exc:
        print(f"Failed to open image: {exc}", file=sys.stderr)
        return 1

    prompt = (
        "Extract all Hebrew text from this image. "
        "Return only the extracted text without additional commentary."
    )
    response = model.generate_content([prompt, image])

    text = (response.text or "").strip()
    if not text:
        print("No text detected.", file=sys.stderr)
        return 1

    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
