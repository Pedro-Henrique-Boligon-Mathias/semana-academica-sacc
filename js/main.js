// Tela de carregamento, contagem regressiva e links de inscrição.
(function () {
  const root = document.documentElement;
  const cfg = window.SACC_CONFIG;

  // Links de inscrição apontam todos para o mesmo formulário
  document.querySelectorAll("[data-forms]").forEach((a) => {
    a.href = cfg.formsUrl;
  });

  // ---- Contagem regressiva ----
  const target = new Date(cfg.eventStart).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  const units = document.querySelectorAll("[data-count]");
  function tick() {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const parts = { d: Math.floor(s / 86400), h: Math.floor((s %= 86400) / 3600), m: Math.floor((s %= 3600) / 60), s: s % 60 };
    units.forEach((el) => { el.textContent = pad(parts[el.dataset.count]); });
  }
  if (units.length) { tick(); setInterval(tick, 1000); }

  // ---- Tela de carregamento ----
  const boot = document.getElementById("boot");
  if (!boot) return;
  if (!root.classList.contains("is-booting")) { boot.remove(); return; }

  const log = boot.querySelector(".boot__log");
  const logo = boot.querySelector(".boot__logo");
  const msg = boot.querySelector(".boot__typed");
  const pct = boot.querySelector(".boot__pct");
  const bar = boot.querySelector(".bar");
  const sfx = (name, ...a) => window.SACC_SOUND && SACC_SOUND.play(name, ...a);
  const BLOCKS = 20;
  for (let i = 0; i < BLOCKS; i++) bar.appendChild(document.createElement("i"));

  const LOG = [
    ["IFFAR-FW BIOS v3.0 · (C) 2026 CIÊNCIA DA COMPUTAÇÃO", ""],
    ["MEMÓRIA BASE ............. ", "640K OK"],
    ["DETECTANDO ESTUDANTES .... ", "OK"],
    ["MONTANDO C:\\SACC ......... ", "OK"],
  ];
  const MESSAGE = "CARREGANDO PROTOCOLO SACC v.3...";

  let finished = false;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function type(el, text, speed) {
    for (let i = 1; i <= text.length && !finished; i++) {
      el.textContent = text.slice(0, i);
      if (i % 2 && text[i - 1] !== " ") sfx("key");
      await sleep(speed);
    }
  }

  function setProgress(p) {
    pct.textContent = `${p}%`;
    sfx("blip", p);
    const on = Math.round((p / 100) * BLOCKS);
    [...bar.children].forEach((b, i) => b.classList.toggle("on", i < on));
  }

  // Avança aos trancos e trava em 99% por um instante, como todo bom instalador.
  async function progress() {
    let p = 0;
    while (p < 100 && !finished) {
      p = Math.min(100, p + 3 + Math.floor(Math.random() * 10));
      if (p >= 99 && p < 100) p = 99;
      setProgress(p);
      if (p === 99) { await sleep(650); p = 100; setProgress(p); break; }
      await sleep(70 + Math.random() * 90);
    }
  }

  function finish() {
    if (finished) return;
    finished = true;
    sfx("powerOff");
    try { sessionStorage.setItem("sacc-booted", "1"); } catch (e) {}
    boot.classList.add("is-leaving");
    setTimeout(() => {
      root.classList.remove("is-booting");
      root.classList.add("is-ready");
      boot.remove();
      removeEventListener("keydown", onKey);
    }, 520);
  }

  function onKey(e) {
    if (e.key === "Escape" || boot.classList.contains("is-done")) finish();
  }

  async function run() {
    for (const [line, status] of LOG) {
      if (finished) return;
      const li = document.createElement("li");
      const text = document.createElement("span");
      li.appendChild(text);
      log.appendChild(li);
      await type(text, line, 12);
      if (status) {
        await sleep(140);
        const ok = document.createElement("span");
        ok.className = "ok";
        ok.textContent = status;
        li.appendChild(ok);
        sfx("ok");
      }
      await sleep(110);
    }
    if (finished) return;
    logo.classList.add("is-on");
    sfx("coin");
    await sleep(450);
    await Promise.all([type(msg, MESSAGE, 40), progress()]);
    if (finished) return;
    boot.classList.add("is-done");
    sfx("ready");
    await sleep(1800);
    finish();
  }

  // O clique no botão já libera o áudio (ver js/sound.js); aqui só some com ele.
  const soundBtn = boot.querySelector(".boot__sound");
  soundBtn.addEventListener("click", () => { soundBtn.hidden = true; sfx("coin"); });
  boot.querySelector(".boot__skip").addEventListener("click", finish);
  boot.addEventListener("click", (e) => {
    if (boot.classList.contains("is-done") && !e.target.closest("button")) finish();
  });
  addEventListener("keydown", onKey);
  run();
})();
