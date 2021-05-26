---
title: Set the width of the tab character
description: You can set the width of the tab. You can even animate this width. I'm not sure why, but you can.
cover: images/cover.png
date: 2021-05-26
dateUpdated: Last Modified
tags:
    - css
    - chunk
---

In our [Web Standards](https://web-standards.ru/podcast/) podcast, we often discuss new features and changes from the latest browsers’ release notes. Imagine my impressions when I found the next text in [Release Notes for Safari Technology Preview 124](https://webkit.org/blog/11672/release-notes-for-safari-technology-preview-124/).

> Supported animation of the `tab-size` CSS property ([r274939](https://trac.webkit.org/changeset/274939/webkit/))

The first one: *“WAT? We had `tab-size` property all this time?”*

The second one: *“WAAAAAT? It can even be animated?”*

## <kbd>tab</kbd> vs <kbd>space</kbd>

At the beginning of time, an endless war began. What should I use to indent my code? One character that costs 1 byte to store, or 4 characters that cost 4 bytes? If you have 1KB of memory on your storage device, it’s pretty critical.

Today we have a [2MB median page](https://almanac.httparchive.org/en/2020/page-weight#page-weight) on the web, so who cares? Code minification, gzip, and IDE settings are your best friends to avoid the holy war. For example, I use [EditorConfig](https://editorconfig.org/) for all my projects. Just to be sure I and my collegues use the same code style.

But what if I prefer tabs and want to show some code snippet to somebody who prefers spaces? How can I help him or her to save the peace of mind?

## tab-size

Let’s make a demo. I want to share the snippet that shows how to use a `tab-size` property.

```css
pre {
	tab-size: 4;
}
```

You can’t see it by default but I use a `\t` character to make an indentation. And because of the default styles of [Prism](https://prismjs.com/) code highlighter attached to my blog, it looks the same as the next snippet with 4 spaces to indent.

```css
pre {
    tab-size: 4;
}
```

Let’s change the value.

<style id="demo-0">
    #demo-0 + pre[class*='language-'] > code[class*='language-'] { -moz-tab-size: 8; tab-size: 8; }
</style>
```css
pre {
    tab-size: 8;
	color: black;
}
```

Now you can see the difference when your colleague has made a commit with `--no-verify`, oh, little villain.

So, the `tab-size: 4` in CSS says *“I want to make a tab character width equal to 4 space characters width”*. And it works!

But I can make this width not relative but absolute.

<style id="demo-1">
    #demo-1 + pre[class*='language-'] > code[class*='language-'] { -moz-tab-size: 1em; tab-size: 1em; }
</style>
```css
pre {
	tab-size: 1em;
}
```

If you read this article in Safari, sorry — you won’t see the difference. But for other browsers, you can set the width of `\t` to absolute units like `px`, `em`, etc.

And yeah, it can be animated.

<style id="demo-2">
    #demo-2 + pre[class*='language-'] > code[class*='language-'] {
        -moz-tab-size: 4;
        tab-size: 4;
        animation: tab 3s ease-in-out infinite alternate;
    }

    @keyframes tab {
        from { -moz-tab-size: 1; tab-size: 1; }
        to { -moz-tab-size: 8; tab-size: 8; }
    }
</style>
```css
pre {
	tab-size: 4;
	animation: tab 3s ease-in-out infinite alternate;
}

@keyframes tab {
	from { tab-size: 1; }
	to { tab-size: 8; }
}
```

Pretty useless, but fun!

Don’t forget about vendor prefixes, `tab-size` still requires a `-moz-` prefix in Firefox. Add your vote [here](https://bugzilla.mozilla.org/show_bug.cgi?id=737785) to increase the bug weight.

IE? No.

## Sources

- [MDN: tab-size](https://developer.mozilla.org/en-US/docs/Web/CSS/tab-size)
