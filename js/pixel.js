// Pixel art do site: sprites, símbolo de circuito e textura ASCII.
// Tudo é gerado em código para ficar nítido em qualquer tela.
(function () {
  const css = getComputedStyle(document.documentElement);
  const token = (name) => css.getPropertyValue(name).trim();

  // Desenha um bitmap (lista de strings) como SVG. Cada caractere
  // presente em `colors` vira um pixel; os outros ficam transparentes.
  function sprite(rows, colors, scale) {
    const h = rows.length;
    const w = Math.max(...rows.map((r) => r.length));
    let rects = "";
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (colors[ch]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${colors[ch]}"/>`;
      });
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" class="sprite" width="${w * scale}" height="${h * scale}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
  }

  const toCursor = (svg, x, y, fallback) =>
    `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${x} ${y}, ${fallback}`;

  const CURSOR = [
    "X...........", "XX..........", "XWX.........", "XWWX........",
    "XWWWX.......", "XWWWWX......", "XWWWWWX.....", "XWWWWWWX....",
    "XWWWWWWWX...", "XWWWWWXXXX..", "XWWXWWX.....", "XWX.XWWX....",
    "XX...XWWX...", "X....XWWX...", ".....XWWX...", "......XX....",
  ];
  const HAND = [
    "....XX.......", "...XWWX......", "...XWWX......", "...XWWX......",
    "...XWWXXX....", "...XWWXWWXXX.", "...XWWXWWXWWX", "XX.XWWWWWWWWX",
    "XWXXWWWWWWWWX", ".XWXWWWWWWWWX", "..XWWWWWWWWWX", "..XWWWWWWWWX.",
    "...XWWWWWWWX.", "...XWWWWWWX..", "....XXXXXXX..",
  ];
  // cursor de "carregando": seta + ampulheta lado a lado, como na arte do evento
  const ARROW_HOURGLASS = [
    "X....................", "XX...................", "XWX..................", "XWWX.................",
    "XWWWX................", "XWWWWX...............", "XWWWWWX..............", "XWWWWWWX.....HHHHHHH.",
    "XWWWWWWWX.....H...H..", "XWWWWWXXXX....HHHHH..", "XWWXWWX........HHH...", "XWX.XWWX........H....",
    "XX...XWWX......H.H...", "X....XWWX.....H.H.H..", ".....XWWX.....HHHHH..", "......XX.....HHHHHHH.",
  ];

  // Ícones 9×9 por tipo de atividade (usados no cronograma)
  const ICONS = {
    palestra:   ["...XXX...", "..X...X..", "..X...X..", "..X...X..", "...XXX...", ".X.....X.", "..XX.XX..", "....X....", "..XXXXX.."],
    minicurso:  [".........", "..X...X..", ".X.....X.", "X...X...X", "...X.....", "X..X....X", ".X.....X.", "..X...X..", "........."],
    competicao: ["XXXXXXXXX", "X.XXXXX.X", "X.XXXXX.X", ".XXXXXXX.", "...XXX...", "....X....", "...XXX...", "..XXXXX..", "........."],
    intervalo:  ["..X.X.X..", ".X.X.X...", ".........", "XXXXXXX..", "X.....XXX", "X.....X.X", "X.....XXX", ".X...X...", "..XXX...."],
    inscricao:  ["XXXXXXX..", "X.....X..", "X.XXX.X..", "X.....X.X", "X.XXX.XXX", "X....XXX.", "X.X.XXX..", "X...XX...", "XXXXX...."],
  };

  // Troca o mouse do sistema pelos sprites (variáveis usadas em css/style.css)
  function setCursors() {
    const colors = { X: "#000", W: token("--phosphor"), H: token("--phosphor") };
    const s = document.documentElement.style;
    s.setProperty("--cur-default", toCursor(sprite(CURSOR, colors, 2), 0, 0, "auto"));
    s.setProperty("--cur-pointer", toCursor(sprite(HAND, colors, 2), 8, 0, "pointer"));
    s.setProperty("--cur-wait", toCursor(sprite(ARROW_HOURGLASS, colors, 2), 0, 0, "wait"));
  }

  // Símbolo de circuito em árvore, redesenhado a partir da arte do evento.
  const LOGO_PATHS = [
    "M520 615 L478 575 L410 542 L355 495",
    "M478 575 L477 490 L447 460 L445 422",
    "M520 615 L565 578 L612 535 L690 515 L725 447",
    "M565 578 L530 540 L530 478 L508 455 L508 400",
    "M530 478 L563 465 L563 372",
    "M612 535 L608 422",
    "M690 515 L660 500 L660 418",
  ];
  const LOGO_NODES = [
    [520, 615], [478, 575], [565, 578], [612, 535], [690, 515], [410, 542], [355, 495], [477, 490],
    [530, 478], [445, 422], [508, 400], [563, 372], [608, 422], [660, 418], [725, 447],
  ];

  function renderLogos() {
    const layer = (stroke, dx, dy) =>
      `<g transform="translate(${dx} ${dy})" fill="none" stroke="${stroke}" stroke-width="7">` +
      LOGO_PATHS.map((d) => `<path d="${d}"/>`).join("") +
      LOGO_NODES.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="${token("--void")}" stroke-width="8"/>`).join("") +
      `</g>`;
    document.querySelectorAll("svg[data-logo]").forEach((svg, i) => {
      const id = `dots-${i}`;
      svg.setAttribute("viewBox", "330 350 420 290");
      svg.innerHTML =
        `<defs><pattern id="${id}" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="${token("--phosphor")}"/></pattern></defs>` +
        `<g class="rgb">` +
        layer(token("--rgb-r"), -4, -3) +
        layer(token("--rgb-y"), -2, -1) +
        layer(token("--rgb-c"), 3, 3) +
        layer(`url(#${id})`, 0, 0) +
        `</g>`;
    });
  }

  // Desenha `text` num canvas minúsculo e troca cada pixel aceso por "3".
  // O canvas é esticado 2× na horizontal porque o caractere é mais alto que largo.
  function asciiShape(text, cols, rows) {
    const c = document.createElement("canvas");
    c.width = cols;
    c.height = rows;
    const ctx = c.getContext("2d");
    ctx.setTransform(2, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${rows * 0.95}px Arial, sans-serif`;
    ctx.fillText(text, cols / 4, rows / 2 + 1);
    const data = ctx.getImageData(0, 0, cols, rows).data;
    let out = "";
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) out += data[(y * cols + x) * 4 + 3] > 110 ? "3" : " ";
      out += "\n";
    }
    return out;
  }

  function renderAscii() {
    document.querySelectorAll("[data-ascii]").forEach((el) => {
      const [cols, rows] = (el.dataset.size || "120x40").split("x").map(Number);
      el.textContent = asciiShape(el.dataset.ascii, cols, rows);
    });
  }

  window.SACC_PIXEL = { sprite, ICONS, token };

  setCursors();
  renderLogos();
  renderAscii();
})();
