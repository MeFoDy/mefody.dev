---
title: Styles of text selection
description: CSS can help you to style text selections if the default selection styles are not compatible with the design of your website.
cover: images/cover.png
date: 2021-12-26
dateUpdated: Last Modified
tags:
    - css
    - chunk
---

Some of you may notice that text selections in this blog are not default. I mean if you select some text its background is not blue. I believe that it is OK to change some defaults to make the design of your website more consistent. CSS can help you with that.

**Disclaimer:** People expect some defaults by... default. And the selection is one of such things. Don’t change the default behavior just because you can. The selection should be obvious.

## Selection

If the default blue background for the selection on your website is not compatible with the design of your website, you can use `::selection` pseudo-element to change it.

```css
::selection {
    color: var(--color-text);
    background: var(--color-accent);
}
```

For ancient Firefox versions (61 and below) don’t forget about `::-moz-selection`.

```css
::-moz-selection {
    color: white;
    background: red;
}
```

The `::selection` pseudo can change not all the CSS properties inside of it. The list is really short:

- `color`;
- `background-color`;
- `text-decoration`;
- `text-shadow`.

If you use SVG, you can also change `stroke-color`, `fill-color`, and `stroke-width`.

This restriction can be simply explained. When the user selects the text, they expect to have an immediate response. And, of course, there should not be any layout shifts. Any background images can cause an image loading, and any margins will cause layout shifts. So, you can change only fast for rendering properties. And when you use `background: blue`, the browser will change it to `background-color: blue`.

It’s important to remember accessibility. The contrast ratio between the background color and text color must be at least `4.5:1`. Don’t forget about the contrast between selection background and element background. If they have almost the same color, your users will be confused.

By default, browsers try to use system settings for selection. For example, macOS users can change the selection color via "OS Settings → General" and Chrome [respects this color](https://github.com/chromium/chromium/blob/c4d3c31083a2e1481253ff2d24298a1dfe19c754/third_party/blink/renderer/core/layout/layout_theme_mac.mm#L59). There is no way to get this color from JS or CSS (it will be a big privacy issue if they can).

## Target selection

There is another selection that Blink browsers have by default. Try to visit [this link](./#:~:text=It%E2%80%99s%20important%20to%C2%A0remember%20accessibility). If you use Chromium-based browser you will see the selection on a text fragment passed to the URL. And you can style this selection too.

```css
::target-text {
    color: white;
    background-color: tomato;
}
```

The `::target-text` has the same restrictions as `::selection`. MDN proposes to change `font-weight` in their example, but I hope [this PR](https://github.com/mdn/content/pull/11497) will be merged soon.

## Sources

- [CSS Pseudo-Elements Module Level 4](https://drafts.csswg.org/css-pseudo-4/#highlight-selectors)
