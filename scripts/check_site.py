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
    "assistant/index.md",
    "getting-started/environment.md",
    "getting-started/first-project.md",
    "courses/gpio.md",
    "courses/exti.md",
    "courses/uart.md",
    "courses/tim-pwm.md",
    "courses/adc-dma.md",
    "courses/i2c.md",
    "courses/spi.md",
    "tracks/beginner.md",
    "tracks/advanced.md",
    "tracks/expert.md",
    "tracks/master.md",
    "boards/index.md",
    "boards/tools.md",
    "projects/led-button.md",
    "projects/uart-console.md",
    "projects/data-logger.md",
    "articles/index.md",
    "articles/stm32f103c8t6-common-problems.md",
    "articles/ai-trends-2026.md",
    "articles/computer-learning-creators.md",
    "resources/index.md",
    "resources/f103-official-docs.md",
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
        "adc-dma-001",
        "i2c-001",
        "spi-001",
        "project-led-button",
        "project-uart-console",
        "project-data-logger",
    }
    missing_ids = expected_lessons - set(lesson_ids)
    if missing_ids:
        errors.append("Missing lesson progress IDs: " + ", ".join(sorted(missing_ids)))

    expected_order = [
        "environment-001",
        "first-project-001",
        "gpio-001",
        "exti-001",
        "uart-001",
        "tim-pwm-001",
        "adc-dma-001",
        "i2c-001",
        "spi-001",
        "project-led-button",
        "project-uart-console",
        "project-data-logger",
    ]
    progress_script = (DOCS / "assets/javascripts/progress.js").read_text(encoding="utf-8")
    actual_order = re.findall(r'\{ id: "([^"]+)"', progress_script)
    if actual_order != expected_order:
        errors.append("Progress catalog order does not match the canonical 01-09 then projects sequence")

    source_pages = [
        "getting-started/environment.md",
        "getting-started/first-project.md",
        "courses/gpio.md",
        "courses/exti.md",
        "courses/uart.md",
        "courses/tim-pwm.md",
        "courses/adc-dma.md",
        "courses/i2c.md",
        "courses/spi.md",
    ]
    for relative in source_pages:
        text = (DOCS / relative).read_text(encoding="utf-8")
        if "## 官方资料与核对路径" not in text:
            errors.append(f"Official source section missing: docs/{relative}")

    source_index = (DOCS / "resources/f103-official-docs.md").read_text(encoding="utf-8")
    assistant_data = (DOCS / "assets/javascripts/assistant-data.js").read_text(encoding="utf-8")
    required_documents = {"DS5319", "RM0008", "PM0056", "ES096"}
    for document_id in required_documents:
        if document_id not in source_index:
            errors.append(f"Required official document missing from source index: {document_id}")
    if assistant_data.count("https://www.st.com/") < 10:
        errors.append("Assistant knowledge base has too few traceable ST official links")

    dated_articles = [
        "articles/stm32f103c8t6-common-problems.md",
        "articles/ai-trends-2026.md",
        "articles/computer-learning-creators.md",
    ]
    for relative in dated_articles:
        text = (DOCS / relative).read_text(encoding="utf-8")
        if "发布日期：2026 年 7 月 30 日" not in text:
            errors.append(f"Article publication date missing: docs/{relative}")
        if text.count("https://") < 3:
            errors.append(f"Article has too few traceable sources: docs/{relative}")

    if not (SITE / "index.html").is_file():
        errors.append("Offline homepage missing: site/index.html")
    if not any(SITE.glob("search/search_index.*")):
        errors.append("Search index missing")
    if not list(SITE.rglob("progress.js")):
        errors.append("Progress script missing from built site")
    if not list(SITE.rglob("assistant-data.js")):
        errors.append("Assistant knowledge base missing from built site")
    if not list(SITE.rglob("assistant.js")):
        errors.append("Assistant script missing from built site")

    for html_file in SITE.rglob("*.html"):
        if html_file.name == "404.html":
            continue
        parser = AssetParser()
        parser.feed(html_file.read_text(encoding="utf-8"))
        for reference in parser.assets:
            if reference.startswith(("data:", "#")):
                continue
            if reference == "https://unpkg.com/iframe-worker/shim":
                # Injected by Material's offline plugin so search can run from file://.
                continue
            if reference.startswith(("http://", "https://", "//")):
                errors.append(f"External runtime asset prevents full offline use: {html_file.relative_to(ROOT)} -> {reference}")
                continue
            asset_path = (html_file.parent / reference.split("?", 1)[0].split("#", 1)[0]).resolve()
            if not asset_path.exists():
                errors.append(f"Missing built asset: {html_file.relative_to(ROOT)} -> {reference}")

    built_pages = [
        "assistant/index.html",
        "getting-started/environment.html",
        "getting-started/first-project.html",
        "courses/gpio.html",
        "courses/exti.html",
        "courses/uart.html",
        "courses/tim-pwm.html",
        "courses/adc-dma.html",
        "courses/i2c.html",
        "courses/spi.html",
        "tracks/beginner.html",
        "tracks/advanced.html",
        "tracks/expert.html",
        "tracks/master.html",
        "boards/index.html",
        "boards/tools.html",
        "projects/index.html",
        "projects/led-button.html",
        "projects/uart-console.html",
        "projects/data-logger.html",
        "articles/index.html",
        "articles/stm32f103c8t6-common-problems.html",
        "articles/ai-trends-2026.html",
        "articles/computer-learning-creators.html",
        "resources/index.html",
        "resources/f103-official-docs.html",
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
    print(
        f"Site verification passed: {markdown_count} pages, "
        f"{len(actual_lessons)} tracked lessons and projects, local site assets present."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
