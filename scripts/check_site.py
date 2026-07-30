from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
SITE = ROOT / "site"

REQUIRED = [
    "index.md",
    "getting-started/environment.md",
    "getting-started/first-project.md",
    "courses/gpio.md",
    "courses/exti.md",
    "courses/uart.md",
    "courses/tim-pwm.md",
    "tracks/beginner.md",
    "tracks/advanced.md",
    "tracks/expert.md",
    "tracks/master.md",
    "boards/index.md",
    "boards/tools.md",
    "projects/led-button.md",
    "projects/uart-console.md",
    "resources/index.md",
]

LINK_RE = re.compile(r"(?<!!)\[[^\]]*\]\(([^)]+)\)")
LESSON_RE = re.compile(r'data-lesson-id="([^"]+)"')


class AssetParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.assets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag in {"script", "img", "source"} and attributes.get("src"):
            self.assets.append(attributes["src"] or "")
        if tag == "link" and attributes.get("href"):
            relations = set((attributes.get("rel") or "").split())
            if relations & {"stylesheet", "icon", "preload", "modulepreload"}:
                self.assets.append(attributes["href"] or "")


def local_target(source: Path, raw: str) -> Path | None:
    target = raw.strip().split(" ", 1)[0].strip("<>")
    if not target or target.startswith(("#", "http://", "https://", "mailto:", "tel:")):
        return None
    target = unquote(target.split("#", 1)[0].split("?", 1)[0])
    return (source.parent / target).resolve()


def main() -> int:
    errors: list[str] = []

    for relative in REQUIRED:
        if not (DOCS / relative).is_file():
            errors.append(f"Missing required page: docs/{relative}")

    lesson_ids: dict[str, Path] = {}
    for source in DOCS.rglob("*.md"):
        text = source.read_text(encoding="utf-8")
        if "TODO" in text or "待补充" in text:
            errors.append(f"Unfinished marker in: {source.relative_to(ROOT)}")

        for lesson_id in LESSON_RE.findall(text):
            if lesson_id in lesson_ids:
                errors.append(
                    f"Duplicate lesson ID {lesson_id}: {lesson_ids[lesson_id].relative_to(ROOT)} and {source.relative_to(ROOT)}"
                )
            lesson_ids[lesson_id] = source

        for raw_link in LINK_RE.findall(text):
            target = local_target(source, raw_link)
            if target is not None and not target.exists():
                errors.append(f"Broken internal link: {source.relative_to(ROOT)} -> {raw_link}")

    expected_lessons = {
        "environment-001",
        "first-project-001",
        "gpio-001",
        "exti-001",
        "uart-001",
        "tim-pwm-001",
    }
    missing_ids = expected_lessons - set(lesson_ids)
    if missing_ids:
        errors.append("Missing lesson progress IDs: " + ", ".join(sorted(missing_ids)))

    if not (SITE / "index.html").is_file():
        errors.append("Offline homepage missing: site/index.html")
    if not any(SITE.glob("search/search_index.*")):
        errors.append("Search index missing")
    if not list(SITE.rglob("progress.js")):
        errors.append("Progress script missing from built site")

    for html_file in SITE.rglob("*.html"):
        if html_file.name == "404.html":
            continue
        parser = AssetParser()
        parser.feed(html_file.read_text(encoding="utf-8"))
        for reference in parser.assets:
            if reference.startswith(("data:", "#")):
                continue
            if reference.startswith(("http://", "https://", "//")):
                errors.append(f"External runtime asset prevents full offline use: {html_file.relative_to(ROOT)} -> {reference}")
                continue
            asset_path = (html_file.parent / reference.split("?", 1)[0].split("#", 1)[0]).resolve()
            if not asset_path.exists():
                errors.append(f"Missing built asset: {html_file.relative_to(ROOT)} -> {reference}")

    built_pages = [
        "getting-started/environment.html",
        "getting-started/first-project.html",
        "courses/gpio.html",
        "courses/exti.html",
        "courses/uart.html",
        "courses/tim-pwm.html",
        "tracks/beginner.html",
        "tracks/advanced.html",
        "tracks/expert.html",
        "tracks/master.html",
        "boards/index.html",
        "boards/tools.html",
        "projects/index.html",
        "projects/led-button.html",
        "projects/uart-console.html",
        "resources/index.html",
        "about/lesson-template.html",
        "about/maintenance.html",
    ]
    for relative in built_pages:
        if not (SITE / relative).is_file():
            errors.append(f"Built page missing: site/{relative}")

    if errors:
        print("Site verification failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    markdown_count = len(list(DOCS.rglob("*.md")))
    actual_lessons = {lesson_id for lesson_id in lesson_ids if lesson_id in expected_lessons}
    print(f"Site verification passed: {markdown_count} pages, {len(actual_lessons)} learning lessons, all runtime assets local.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
