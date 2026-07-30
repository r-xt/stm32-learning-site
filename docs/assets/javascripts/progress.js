(() => {
  "use strict";

  const STORAGE_KEY = "stm32-learning-progress-v1";

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function lessonTitle(container) {
    return container.dataset.lessonTitle || document.querySelector("h1")?.textContent?.trim() || "未命名课程";
  }

  function renderLessonControls(root = document) {
    root.querySelectorAll(".lesson-progress[data-lesson-id]").forEach((container) => {
      if (container.dataset.ready === "true") return;
      container.dataset.ready = "true";
      const id = container.dataset.lessonId;
      const state = loadState();
      const status = document.createElement("span");
      const button = document.createElement("button");

      const redraw = () => {
        const complete = Boolean(loadState()[id]?.complete);
        status.textContent = complete ? "已完成并保存在本机" : "尚未标记完成";
        button.textContent = complete ? "设为未完成" : "标记为已完成";
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

      container.append(status, button);
      redraw();
    });
  }

  function renderProgressPanel(root = document) {
    root.querySelectorAll(".progress-panel").forEach((panel) => {
      if (panel.dataset.ready === "true") return;
      panel.dataset.ready = "true";
      panel.innerHTML = `
        <strong>本机学习记录</strong>
        <div class="progress-summary"></div>
        <div class="progress-panel__actions">
          <button type="button" data-action="export">导出 JSON</button>
          <label class="import-label">导入 JSON<input type="file" accept="application/json,.json" data-action="import"></label>
          <button type="button" data-action="clear">清除记录</button>
        </div>
        <div class="progress-message" role="status" aria-live="polite"></div>`;

      const summary = panel.querySelector(".progress-summary");
      const message = panel.querySelector(".progress-message");
      const redraw = () => {
        const entries = Object.values(loadState());
        const complete = entries.filter((item) => item?.complete).length;
        summary.textContent = `已完成 ${complete} 项，共记录 ${entries.length} 项。数据只保存在当前浏览器。`;
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
          const parsed = JSON.parse(await file.text());
          const lessons = parsed?.version === 1 ? parsed.lessons : parsed;
          if (!lessons || typeof lessons !== "object" || Array.isArray(lessons)) throw new Error("格式错误");
          saveState(lessons);
          message.textContent = "导入成功，课程状态已更新。";
          renderLessonControls();
          window.location.reload();
        } catch (_) {
          message.textContent = "导入失败：请选择本站导出的 JSON 文件。";
        }
      });

      panel.querySelector('[data-action="clear"]').addEventListener("click", () => {
        if (!window.confirm("确定清除当前浏览器中的全部学习记录吗？")) return;
        localStorage.removeItem(STORAGE_KEY);
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

