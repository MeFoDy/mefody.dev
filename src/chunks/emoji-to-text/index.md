---
title: 'Prevent text glyphs from turning into emojis'
description: Sometimes you need to disable some text glyphs to be rendered as emojis. Let’s find a way to do it.
cover: images/cover.jpg
date: 2021-09-19
dateUpdated: Last Modified
tags:
    - html
    - css
    - chunk
---

Last year I had an interesting task to make a heart symbol a part of a page title. We were organizing ’Ya Love Frontend’ conference (Ya is for Yandex, but it sounds the same as ’I’ in Russian), and we used the UTF-8 heart symbol to make the title more emotional.

So, what’s the problem?

If you have the title ’I ❤ Frontend’, it is rendered differently in different browsers on different operating systems. For example, on Android and iOS it looks like emoji. And that’s a huge problem if you have to style the title.

## Unicode

It’s all about rendering. Nikita Prokopov described it in [his detailed article about emojis](https://tonsky.me/blog/emoji/).

Every symbol you use has its UTF-8 sequence. For example, letter A is `U+0041`, letter Z is `U+005A`, $ is `U+0024`, etc. The same is for emoji, ❤ is `U+2764`.

You can even paste it into your HTML as a Unicode sequence, not a symbol.

```html
<span>I ❤ Frontend</span>
or
<span>I &#x2764; Frontend</span>
```

`&#x` is for Unicode prefixing.

But what if the current font hasn’t any glyph that can render your UTF-8 symbol? OS tries to find any font that has that glyph. So, iOS will find the Apple Color Emoji font, Android will find the Noto Color Emoji font, etc. And it looks like we have some possibilities to control it.

### Fonts

The first decision is to have a font that has all your necessary glyphs. For example, Arial. Or some custom font. You need to add that font to font fallbacks in your CSS.

```css
body {
    font-family: 'Text Font', 'Custom Glyphs Font', sans-serif;
}
```

I don’t like such solutions because I can’t control all the glyphs in the text. Especially if I have some kind of content management system. And it’s a pain to rebuild the font every time I need a new glyph.

### Variation selectors

Luckily, we have another option. UTF has special characters to control the rendering. `U+FE0E` asks OS and browser to render the previous glyph as text, `U+FE0F` asks to render the previous glyph as emoji.

So, let’s try to use it.

```html
<ul>
    <li>&#x2600; can be rendered differently.</li>
    <li>&#x2600;&#xFE0F; should look like a sun emoji.</li>
    <li>&#x2600;&#xFE0E; should look like a sun text symbol.</li>
</ul>
```

<ul>
    <li>&#x2600; can be rendered differently.</li>
    <li>&#x2600;&#xFE0F; should look like a sun emoji.</li>
    <li>&#x2600;&#xFE0E; should look like a sun text symbol.</li>
</ul>

So, if you need to disable emoji in your text, convert the symbol to UTF-8 or UTF-16 sequence (`symbol.codePointAt(0).toString(16)`), than add `&#xFE0E` to it.

```html
<span>I &#x2764;&#xFE0E; Frontend</span>
```

But it won’t work for the heart emoji on Android. I don’t know why. When we tested it last year, it was ok, but... You can play around with different emojis [in this sandbox](https://codepen.io/dark_mefody/pen/NWgMxrd). As for me, something is better than nothing.

## Accessibility

Remember that all emojis have text representations. For example, ⭐︎ is `white medium star`, ► is `black right-pointing pointer`, etc. And screen readers will use these texts.

So, our `I ❤ Frontend` becomes `I Red Heart Frontend`. I suppose we didn’t mean that.

To fix it, use the glyph [the right way](https://tink.uk/accessible-emoji/).

```html
<span role="img" aria-label="Love">&#x2764;</span>
```

And the final result we used on the conference website is below.

```html
<h1>
    I <span role="img" aria-label="Love">&#x2764;&#xFE0E;</span> Frontend!
</h1>
```

## Resources

- [Emoji under the hood](https://tonsky.me/blog/emoji/)
- [Unicode symbol as text or emoji](https://mts.io/2015/04/21/unicode-symbol-render-text-emoji/)
- [U+FE0E VARIATION SELECTOR-15](https://codepoints.net/U+FE0E)
- [Accessible emoji](https://tink.uk/accessible-emoji/)
