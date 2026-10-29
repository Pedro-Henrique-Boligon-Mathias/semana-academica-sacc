// Efeitos sonoros arcade, sintetizados na hora com Web Audio (sem arquivos de áudio).
// O navegador só libera som depois do primeiro clique ou tecla, então até lá tudo fica mudo.
(function () {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let unlocked = false;
  let muted = false;
  try { muted = localStorage.getItem("sacc-mute") === "1"; } catch (e) {}

  function unlock() {
    if (!AudioCtx) return;
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();
    unlocked = true;
  }
  ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
    addEventListener(ev, unlock, { capture: true, passive: true })
  );

  // Um bipe de onda quadrada; `to` faz a frequência deslizar até outro valor.
  function tone({ freq, to, dur = 0.08, type = "square", vol = 0.05, delay = 0 }) {
    if (muted || !unlocked || !ctx) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  const notes = (seq, step, opts) =>
    seq.forEach((f, i) => tone({ freq: f, dur: step * 1.1, delay: i * step, ...opts }));

  const SFX = {
    key:      () => tone({ freq: 1600 + Math.random() * 500, dur: 0.012, vol: 0.015 }),
    ok:       () => notes([880, 1320], 0.06),
    blip:     (p) => tone({ freq: 200 + p * 8, dur: 0.03, vol: 0.025 }),
    coin:     () => { tone({ freq: 988, dur: 0.08 }); tone({ freq: 1319, dur: 0.35, delay: 0.08 }); },
    ready:    () => notes([523, 659, 784, 1047], 0.09, { vol: 0.045 }),
    powerOff: () => tone({ freq: 1400, to: 30, dur: 0.45, type: "sawtooth", vol: 0.04 }),
    hover:    () => tone({ freq: 660, dur: 0.025, vol: 0.02 }),
    click:    () => tone({ freq: 440, to: 1100, dur: 0.09, vol: 0.04 }),
    toggleOn: () => notes([660, 990], 0.05),
  };

  function play(name, ...args) {
    if (SFX[name]) SFX[name](...args);
  }

  // Hover e clique em tudo que é clicável
  let hovered = null;
  document.addEventListener("pointerover", (e) => {
    if (e.pointerType !== "mouse") return;
    const el = e.target.closest("a, button");
    if (el && el !== hovered) play("hover");
    hovered = el;
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest("a, button") && !e.target.closest("[data-sound-toggle]")) play("click");
  });

  // Botão de ligar/desligar o som (no menu)
  function renderToggles() {
    document.querySelectorAll("[data-sound-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(!muted));
      btn.querySelector("[data-sound-label]").textContent = muted ? "SOM OFF" : "SOM ON";
    });
  }
  document.querySelectorAll("[data-sound-toggle]").forEach((btn) =>
    btn.addEventListener("click", () => {
      muted = !muted;
      try { localStorage.setItem("sacc-mute", muted ? "1" : "0"); } catch (e) {}
      renderToggles();
      unlock();
      play("toggleOn");
    })
  );
  renderToggles();

  window.SACC_SOUND = { play };
})();
