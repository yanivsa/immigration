## 2026-05-08 - Optimize generateSitemap
**Learning:** Replaced sequential loop with Promise.all in file processing for SEO sitemap generation to significantly improve I/O bound performance.
**Action:** Always prefer Promise.all when reading or writing many independent files to optimize wait times.
