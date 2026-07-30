(() => {
  "use strict";

  const STORAGE_KEY = "stm32-learning-progress-v1";
  const LESSONS = [
    { id: "environment-001", title: "01 · 环境搭建", path: "getting-started/environment/", stage: "基础" },
    { id: "first-project-001", title: "02 · 第一个工程", path: "getting-started/first-project/", stage: "基础" },
    { id: "gpio-001", title: "03 · GPIO 输入输出", path: "courses/gpio/", stage: "基础" },
    { id: "exti-001", title: "04 · EXTI 外部中断", path: "courses/exti/", stage: "基础" },
    { id: "uart-001", title: "05 · UART 串口通信", path: "courses/uart/", stage: "基础" },
    { id: "tim-pwm-001", title: "06 · TIM 与 PWM", path: "courses/tim-pwm/", stage: "基础" },
    { id: "adc-dma-001", title: "07 · ADC 与 DMA 采样", path: "courses/adc-dma/", stage: "进阶" },
    { id: "i2c-001", title: "08 · I²C 传感器通信", path: "courses/i2c/", stage: "进阶" },
    { id: "spi-001", title: "09 · SPI 与外部器件", path: "courses/spi/", stage: "进阶" },
    { id: "project-led-button", title: "项目 1 · LED 与按键控制器", path: "projects/led-button/", stage: "项目" },
    { id: "project-uart-console", title: "项目 2 · 串口命令行终端", path: "projects/uart-console/", stage: "项目" },
    { id: "project-data-logger", title: "项目 3 · 多外设数据记录器", path: "projects/data-logger/", stage: "项目" }
  ];

  function sanitizeState(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const clean = {};
    Object.entries(value).slice(0, 100).forEach(([id, item]) => {
      if (!id || id.length > 80 || !item || typeof item !== "object") return;
      clean[id] = {
        complete: Boolean(item.complete),
        title: String(item.title || "").slice(0, 100),
        updatedAt: String(item.updatedAt || "").slice(0, 40)
      };
    });
    return clean;
  }

  function loadState() {
    try {
      return sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch (_) {
      return {};
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(state)));
    } catch (_) {
      // Progress controls still work for the current page when storage is unavailable.
    }
  }

  function lessonTitle(container) {
    return container.dataset.lessonTitle || document.querySelector("h1")?.textContent?.trim() || "未命名课程";
  }

  function rootUrl() {
    return document.querySelector("a.md-header__button.md-logo")?.href || new URL("./", window.location.href).href;
  }

  function resolvePath(path) {
    const target = String(path).replace(/^\/+|\/+$/g, "");
    const navLink = Array.from(document.querySelectorAll("a[href]")).find((link) => {
      try {
        const pathname = new URL(link.href).pathname
          .replace(/\/index\.html$/, "")
          .replace(/\.html$/, "")
          .replace(/\/$/, "");
        return pathname.endsWith(`/${target}`);
      } catch (_) {
        return false;
      }
    });
    return navLink?.href || new URL(path, rootUrl()).href;
  }

  function createLessonLink(lesson, label) {
    const link = document.createElement("a");
    link.href = resolvePath(lesson.path);
    link.textContent = label;
    link.className = "lesson-progress__link";
    return link;
  }

  function renderLessonControls(root = document) {
    root.querySelectorAll(".lesson-progress[data-lesson-id]").forEach((container) => {
      if (container.dataset.ready === "true") return;
      container.dataset.ready = "true";

      const id = container.dataset.lessonId;
      const catalogIndex = LESSONS.findIndex((lesson) => lesson.id === id);
      const status = document.createElement("span");
      status.className = "lesson-progress__status";
      const button = document.createElement("button");
      const navigation = document.createElement("nav");
      navigation.className = "lesson-progress__navigation";
      navigation.setAttribute("aria-label", "课程前后导航");

      const redraw = () => {
        const complete = Boolean(loadState()[id]?.complete);
        status.textContent = complete ? "已完成 · 保存在本机" : "尚未完成";
        button.textContent = complete ? "取消完成" : "标记完成";
        button.classList.toggle("is-complete", complete);
        button.setAttribute("aria-pressed", String(complete));
      };

      button.type = "button";
      button.addEventListener("click", () => {
        const next = loadState();
        const complete = !Boolean(next[id]?.complete);
        next[id] = {
          complete,
          title: lessonTitle(container),
          updatedAt: new Date().toISOString()
        };
        saveState(next);
        redraw();
        window.dispatchEvent(new CustomEvent("stm32-progress-change"));
      });

      if (catalogIndex > 0) {
        navigation.append(createLessonLink(LESSONS[catalogIndex - 1], `← ${LESSONS[catalogIndex - 1].title}`));
      }
      if (catalogIndex >= 0 && catalogIndex < LESSONS.length - 1) {
        navigation.append(createLessonLink(LESSONS[catalogIndex + 1], `${LESSONS[catalogIndex + 1].title} →`));
      }

      container.append(status, button, navigation);
      window.addEventListener("stm32-progress-change", redraw);
      redraw();
    });
  }

  function renderCurriculum(list, state) {
    list.replaceChildren();
    LESSONS.forEach((lesson) => {
      const item = document.createElement("li");
      const complete = Boolean(state[lesson.id]?.complete);
      item.className = complete ? "is-complete" : "";

      const marker = document.createElement("span");
      marker.className = "progress-curriculum__marker";
      marker.textContent = complete ? "✓" : String(LESSONS.indexOf(lesson) + 1);
      marker.setAttribute("aria-hidden", "true");

      const link = document.createElement("a");
      link.href = resolvePath(lesson.path);
      link.textContent = lesson.title;

      const stage = document.createElement("small");
      stage.textContent = lesson.stage;
      item.append(marker, link, stage);
      list.append(item);
    });
  }

  function renderProgressPanel(root = document) {
    root.querySelectorAll(".progress-panel").forEach((panel) => {
      if (panel.dataset.ready === "true") return;
      panel.dataset.ready = "true";
      panel.innerHTML = `
        <div class="progress-panel__heading">
          <div>
            <strong>本机学习记录</strong>
            <div class="progress-summary"></div>
          </div>
          <span class="progress-percent" aria-label="完成比例">0%</span>
        </div>
        <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${LESSONS.length}" aria-valuenow="0">
          <span></span>
        </div>
        <div class="progress-next"></div>
        <details class="progress-details">
          <summary>查看完整学习清单</summary>
          <ol class="progress-curriculum"></ol>
        </details>
        <div class="progress-panel__actions">
          <button type="button" data-action="export">导出进度</button>
          <label class="import-label">导入进度<input type="file" accept="application/json,.json" data-action="import"></label>
          <button type="button" class="is-danger" data-action="clear">清除记录</button>
        </div>
        <div class="progress-message" role="status" aria-live="polite"></div>`;

      const summary = panel.querySelector(".progress-summary");
      const percent = panel.querySelector(".progress-percent");
      const track = panel.querySelector(".progress-track");
      const trackFill = track.querySelector("span");
      const nextBox = panel.querySelector(".progress-next");
      const curriculum = panel.querySelector(".progress-curriculum");
      const message = panel.querySelector(".progress-message");

      const redraw = () => {
        const state = loadState();
        const complete = LESSONS.filter((lesson) => state[lesson.id]?.complete).length;
        const ratio = Math.round((complete / LESSONS.length) * 100);
        const nextLesson = LESSONS.find((lesson) => !state[lesson.id]?.complete);

        summary.textContent = `已完成 ${complete}/${LESSONS.length} 项，数据只保存在当前浏览器。`;
        percent.textContent = `${ratio}%`;
        track.setAttribute("aria-valuenow", String(complete));
        trackFill.style.width = `${ratio}%`;
        nextBox.replaceChildren();

        if (nextLesson) {
          const label = document.createElement("span");
          label.textContent = "建议继续：";
          nextBox.append(label, createLessonLink(nextLesson, nextLesson.title));
        } else {
          nextBox.textContent = "基础与进阶清单已完成，可以选择专家路线继续。";
        }

        renderCurriculum(curriculum, state);
      };

      panel.querySelector('[data-action="export"]').addEventListener("click", () => {
        const payload = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), lessons: loadState() }, null, 2);
        const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
        const link = Object.assign(document.createElement("a"), { href: url, download: "stm32-learning-progress.json" });
        link.click();
        URL.revokeObjectURL(url);
        message.textContent = "学习记录已导出。";
      });

      panel.querySelector('[data-action="import"]').addEventListener("change", async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          if (file.size > 100000) throw new Error("文件过大");
          const parsed = JSON.parse(await file.text());
          const lessons = parsed?.version === 1 ? parsed.lessons : parsed;
          if (!lessons || typeof lessons !== "object" || Array.isArray(lessons)) throw new Error("格式错误");
          saveState(lessons);
          message.textContent = "导入成功，课程状态已更新。";
          window.dispatchEvent(new CustomEvent("stm32-progress-change"));
        } catch (_) {
          message.textContent = "导入失败：请选择本站导出的进度 JSON 文件。";
        } finally {
          event.target.value = "";
        }
      });

      panel.querySelector('[data-action="clear"]').addEventListener("click", () => {
        if (!window.confirm("确定清除当前浏览器中的全部学习记录吗？")) return;
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) {
          // No additional action is required.
        }
        message.textContent = "学习记录已清除。";
        redraw();
        window.dispatchEvent(new CustomEvent("stm32-progress-change"));
      });

      window.addEventListener("stm32-progress-change", redraw);
      redraw();
    });
  }

  function boot() {
    renderLessonControls();
    renderProgressPanel();
  }

  document.addEventListener("DOMContentLoaded", boot);
  if (typeof document$ !== "undefined") document$.subscribe(boot);
})();
