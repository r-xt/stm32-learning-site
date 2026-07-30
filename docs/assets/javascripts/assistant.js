(() => {
  "use strict";

  const HISTORY_KEY = "stm32-assistant-history-v3";
  const data = window.STM32_ASSISTANT_KNOWLEDGE;
  if (!data) return;

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[，。！？、,.!?：:；;（）()\s_-]+/g, "");

  function loadHistory() {
    try {
      const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      return Array.isArray(value) ? value.slice(-20) : [];
    } catch (_) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-20)));
    } catch (_) {
      // The assistant still works when browser storage is unavailable.
    }
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

  function scoreEntry(entry, question) {
    const query = normalize(question);
    const title = normalize(entry.title);
    let score = query.includes(title) || title.includes(query) ? 12 : 0;

    entry.keywords.forEach((keyword) => {
      const key = normalize(keyword);
      if (!key) return;
      if (query === key) score += 12;
      else if (query.includes(key)) score += Math.max(4, Math.min(9, key.length));
      else if (/^[a-z0-9+#]+$/i.test(key) && query.includes(key)) score += 5;
    });

    return score;
  }

  function findAnswer(question) {
    const ranked = data.entries
      .map((entry) => ({ entry, score: scoreEntry(entry, question) }))
      .sort((a, b) => b.score - a.score);

    if (!ranked[0] || ranked[0].score < 4) return null;
    return ranked[0].entry;
  }

  function createMessage(role, payload) {
    const message = document.createElement("article");
    message.className = `stm-assistant__message stm-assistant__message--${role}`;

    if (role === "user") {
      message.textContent = payload.text;
      return message;
    }

    const title = document.createElement("strong");
    title.textContent = payload.title || "STM32 学习助手";
    message.append(title);

    (payload.answer || []).forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      message.append(paragraph);
    });

    if (payload.links?.length) {
      const links = document.createElement("div");
      links.className = "stm-assistant__sources";
      payload.links.forEach(([label, path]) => {
        const link = document.createElement("a");
        link.href = resolvePath(path);
        link.textContent = label;
        if (/^https?:\/\//i.test(String(path))) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        links.append(link);
      });
      message.append(links);
    }

    return message;
  }

  function buildAssistant() {
    if (document.querySelector(".stm-assistant")) return;

    const shell = document.createElement("div");
    shell.className = "stm-assistant";
    shell.innerHTML = `
      <button class="stm-assistant__launcher" type="button" aria-label="打开 STM32 本地知识助手" aria-expanded="false">
        <span class="stm-assistant__launcher-icon" aria-hidden="true">问</span>
        <span>问助手</span>
      </button>
      <section class="stm-assistant__panel" aria-label="STM32 本地知识助手" aria-hidden="true">
        <header class="stm-assistant__header">
          <div>
            <strong>STM32 本地知识助手</strong>
            <small>${data.entries.length} 个主题 · 对话不上传</small>
          </div>
          <div class="stm-assistant__header-actions">
            <button type="button" data-action="maximize" aria-label="放大助手">放大</button>
            <button type="button" data-action="clear" aria-label="清除对话">清空</button>
            <button type="button" data-action="close" aria-label="关闭助手">×</button>
          </div>
        </header>
        <div class="stm-assistant__messages" role="log" aria-live="polite"></div>
        <div class="stm-assistant__quick" aria-label="常见问题"></div>
        <form class="stm-assistant__form">
          <label class="sr-only" for="stm-assistant-input">输入问题</label>
          <textarea id="stm-assistant-input" rows="2" maxlength="300" placeholder="例如：串口乱码怎么排查？"></textarea>
          <button type="submit">发送</button>
        </form>
        <p class="stm-assistant__notice">回答来自本站人工整理的本地知识库；带“ST 官方”标记的链接可用于核对原文，具体芯片参数请以对应型号的最新官方文档为准。</p>
      </section>`;
    document.body.append(shell);

    const launcher = shell.querySelector(".stm-assistant__launcher");
    const panel = shell.querySelector(".stm-assistant__panel");
    const messages = shell.querySelector(".stm-assistant__messages");
    const quick = shell.querySelector(".stm-assistant__quick");
    const form = shell.querySelector(".stm-assistant__form");
    const input = shell.querySelector("textarea");
    const maximizeButton = shell.querySelector('[data-action="maximize"]');
    let history = loadHistory();

    const fallback = {
      title: "本地知识库暂时没有匹配答案",
      answer: [
        "你可以换用更具体的关键词，例如芯片型号、外设名称和故障现象。当前助手擅长 GPIO、EXTI、UART、定时器、DMA、RTOS、C 语言与常见调试问题。",
        "如果问题涉及特定芯片寄存器、电气参数或最新工具版本，请同时查阅对应型号的官方文档。"
      ],
      links: [["查看资源中心", "resources/"], ["浏览学习路线", "tracks/"]]
    };

    function append(role, payload, persist = true) {
      messages.append(createMessage(role, payload));
      messages.scrollTop = messages.scrollHeight;
      if (!persist) return;
      history.push(role === "user"
        ? { role, text: payload.text }
        : { role, title: payload.title, answer: payload.answer, links: payload.links || [] });
      saveHistory(history);
    }

    function renderHistory() {
      messages.replaceChildren();
      if (!history.length) {
        append("assistant", {
          title: "你好，我是 STM32 本地知识助手",
          answer: ["我不是生成式 AI，会从人工整理的主题中匹配答案。可以问 STM32 入门、外设、调试、C 语言和基础计算机知识。请尽量写出芯片、外设和故障现象。"]
        }, false);
        return;
      }
      history.forEach((item) => append(item.role, item, false));
    }

    function ask(question) {
      const text = question.trim();
      if (!text) return;
      append("user", { text });
      const answer = findAnswer(text) || fallback;
      window.setTimeout(() => append("assistant", answer), 120);
    }

    function setOpen(open) {
      shell.classList.toggle("is-open", open);
      launcher.setAttribute("aria-expanded", String(open));
      panel.setAttribute("aria-hidden", String(!open));
      if (open) window.setTimeout(() => input.focus(), 50);
      if (!open && shell.classList.contains("is-maximized")) {
        shell.classList.remove("is-maximized");
        maximizeButton.textContent = "放大";
        maximizeButton.setAttribute("aria-label", "放大助手");
      }
    }

    data.quickQuestions.slice(0, 6).forEach((question) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = question;
      button.addEventListener("click", () => ask(question));
      quick.append(button);
    });

    launcher.addEventListener("click", () => setOpen(!shell.classList.contains("is-open")));
    shell.querySelector('[data-action="close"]').addEventListener("click", () => setOpen(false));
    maximizeButton.addEventListener("click", () => {
      const maximized = !shell.classList.contains("is-maximized");
      shell.classList.toggle("is-maximized", maximized);
      maximizeButton.textContent = maximized ? "还原" : "放大";
      maximizeButton.setAttribute("aria-label", maximized ? "还原助手大小" : "放大助手");
      messages.scrollTop = messages.scrollHeight;
      input.focus();
    });
    shell.querySelector('[data-action="clear"]').addEventListener("click", () => {
      history = [];
      try {
        localStorage.removeItem(HISTORY_KEY);
      } catch (_) {
        // Nothing else is required when browser storage is unavailable.
      }
      renderHistory();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      ask(input.value);
      input.value = "";
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && shell.classList.contains("is-open")) setOpen(false);
    });

    window.addEventListener("stm32-assistant-open", () => setOpen(true));
    renderHistory();
  }

  function boot() {
    buildAssistant();
    document.querySelectorAll("[data-open-stm-assistant]").forEach((button) => {
      if (button.dataset.assistantReady === "true") return;
      button.dataset.assistantReady = "true";
      button.addEventListener("click", () => window.dispatchEvent(new Event("stm32-assistant-open")));
    });
  }

  document.addEventListener("DOMContentLoaded", boot);
  if (typeof document$ !== "undefined") document$.subscribe(boot);
})();
