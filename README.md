# Semana Acadêmica · Ciência da Computação · IFFAR/FW

Site da 3ª Semana Acadêmica de Ciência da Computação do IFFAR, campus Frederico Westphalen (Protocolo SACC v.3), de **09 a 13 de novembro de 2026**.

## Identidade visual

O guia está em [`docs/identidade-visual.html`](docs/identidade-visual.html). Abra no navegador para ver cores, fontes, elementos em pixel art, componentes e animações.

- Estética de terminal antigo / CRT, magenta neon sobre preto, grade synthwave
- Fontes (Google Fonts): Silkscreen (títulos), Pixelify Sans (subtítulos), VT323 (texto)
- Animações em degraus (`steps()`), respeitando "reduzir movimento"

## Arquivos

```
index.html          página do site
css/style.css       todos os estilos (cores, fontes, componentes, animações)
js/config.js        link do Google Forms e data de início do evento
js/pixel.js         pixel art: mouse, ícones, símbolo de circuito, textura ASCII
js/sound.js         efeitos sonoros arcade (Web Audio, sem arquivos)
js/main.js          tela de carregamento, contagem regressiva, links de inscrição
assets/favicon.svg  ícone da aba
docs/               guia de identidade visual
```

## Rodar localmente

Sem build nem dependências. Na pasta do projeto:

```bash
python3 -m http.server 5173
```

Depois abra http://localhost:5173. A tela de carregamento aparece uma vez por sessão; para ver de novo, use http://localhost:5173/?boot

## Estrutura do site

1. Tela de carregamento (boot)
2. Sobre o evento
3. Cronograma (abas por dia)
4. Inscrição (link para o Google Forms)
5. Rodapé

## Autor

Desenvolvido por [Pedro Henrique Boligon Mathias](https://github.com/Pedro-Henrique-Boligon-Mathias).
