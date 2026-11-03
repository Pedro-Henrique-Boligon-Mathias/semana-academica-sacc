// Pixel art do site: sprites e árvore ASCII.
(function () {
  const css = getComputedStyle(document.documentElement);
  const token = (name) => css.getPropertyValue(name).trim();

  // Desenha um bitmap como SVG: cada caractere em `colors` vira um pixel.
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

  function setCursors() {
    const colors = { X: "#000", W: token("--phosphor"), H: token("--phosphor") };
    const s = document.documentElement.style;
    s.setProperty("--cur-default", toCursor(sprite(CURSOR, colors, 2), 0, 0, "auto"));
    s.setProperty("--cur-pointer", toCursor(sprite(HAND, colors, 2), 8, 0, "pointer"));
    s.setProperty("--cur-wait", toCursor(sprite(ARROW_HOURGLASS, colors, 2), 0, 0, "wait"));
  }

  // Logo do curso em ASCII, feita com o número 3.
  const LOGO_ASCII = [
    "                                               333333",
    "                                             333   333",
    "                                             33     33",
    "                                    3333     333333333",
    "                                  33333333     33333",
    "                                 333    33      333                 33333",
    "                     3333333     333   333      333     3333333   3333 3333",
    "                    333   333      333333       333    333   333  33    333",
    "                    33    333       333         333    333    33  333   333",
    "                    33333333        333         333     33333333    33333        3333333",
    "                      33333         333         333       3333       33         333   333",
    "                       333            333       333        33        33         333   333",
    "                       333             333333   333        33        33          3333333",
    "                       333            3333 3333333         33        33            333",
    "   333                 333  333333    33     33            33        33            333",
    " 3333333                333333  333   3333 3333            33        33            333",
    "333    33                  33    333    33333              33        333   33333  3333",
    "333   333                  33333333       33               33        3333333333333333",
    " 3333333                     3333         33               33            33    333",
    "     333       3333           33          33             3333333         333   333",
    "      3333   33333333         33          33            333   333         333333",
    "        3333333    33         33          33            33    3333333333333",
    "            333   333         33          33            33333333",
    "              333333          333         3333         3333333",
    "                3333       33333333         3333333333333",
    "                3333333333333    333          333   333",
    "                           33    333          33    333",
    "                            33333333           3333333",
    "                                  333333333 33333333",
    "                                    3333 33333",
    "                                    333    33",
    "                                    3333  333",
    "                                      33333",
  ].join("\n");

  function renderAscii() {
    document.querySelectorAll("[data-ascii]").forEach((el) => {
      el.textContent = LOGO_ASCII;
    });
  }

  window.SACC_PIXEL = { sprite, ICONS, token };

  setCursors();
  renderAscii();
})();
