---
title: A CSS editor written in CSS
description: No JavaScript, no libraries. Modern CSS and HTML only.
cover: images/cover.jpg
date: 2024-02-08
dateUpdated: Last Modified
tags:
    - html
    - css
    - chunk
---

{% import "macros.njk" as macros with context %}

I found an [interesting tooth](https://front-end.social/@mia/111889170998301977) by Miriam Suzanne. She suggests combining `@scope`, CSS Container Queries, and a bit of `contenteditable` magic to make a CSS editor in CSS. No JavaScript, no libraries. Let's try it out!

## HTML

```html
<css-demo>
    <div class="panels">
        <style spellcheck="false" contenteditable>
@scope {
    /* Demo CSS */
}
        </style>
        <div class="demo">
            <!-- Demo HTML -->
        </div>
    </div>
</css-demo>
```

Our custom tag `<css-demo>` has `display: inline` by default, just like a `span`. We need to change it in CSS later.

With `contenteditable` attribute on a tag you can edit the text of the tag. We've already used it [here](/chunks/design-mode/).

Add `spellcheck="false"` to disable automatic spell checking. Yeah, browser, I see that my CSS is not really English.

## CSS

All the magic happens here.

Let's make a grid with two columns of the same width.

```css
* {
    box-sizing: border-box;
}

css-demo {
    --height: 100vh; /* let's make it fullscreen */

    height: var(--height);
    display: block; /* fix default `inline` behaviour */

    .panels {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: var(--height);
        border: 3px solid #777;

        > style {
            height: 100%;
        }

        > .demo {
            display: grid;
            place-items: center;
            border-left: 3px solid #777;
        }
    }
}
```

Yeah, I use CSS Nesting, why not? It looks suitable here. And there is a pretty border to separate the code and the demo.

I added a `.panels` wrapper to Miriam's example to have more freedom to style the container.

Then we need to make our `<style>` content visible and readable.

```css
style {
    display: block; /* magic! */
    font-family: "Fira Code", monospace;
    white-space: pre;
    overflow: scroll;
    padding: 1em 1.5em;
}
```

You can use any monospaced font to display the code.

Make sure you use `white-space: pre` to display the CSS code as it was written in your demo source code.

Let's make it adaptive and embeddable. CSS Container Queries — that's your time!

```css
css-demo {
    container: css-demo / size;
}

@container css-demo (width < 800px) {
    .panels {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }
}
```

And let's make our demo better for dark theme users.

```css
@media (prefers-color-scheme: dark) {
    html {
        color-scheme: dark;
    }
}
```

Combine it all.

```css
* {
    box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
    html {
        color-scheme: dark;
    }
}

css-demo {
    --height: 100vh;
    height: var(--height);
    display: block;
    container: css-demo / size;

    .panels {
        display: grid;
        height: var(--height);
        grid-template-columns: 1fr 1fr;
        border: 3px solid #777;

        > style {
            display: block;
            font-family: "Fira Code", monospace;
            white-space: pre;
            overflow: scroll;
            height: 100%;
            padding: 1em 1.5em;
        }

        > .demo {
            display: grid;
            place-items: center;
            border-left: 3px solid #777;
        }

        @container css-demo (width < 800px) {
            & {
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 1fr;

                > .demo {
                    border-top: 3px solid #777;
                    border-left: none;
                }
            }
        }
    }
}
```
</details>

You can play with the component [here](https://codepen.io/dark_mefody/full/PoLdPoY).

Unfortunately, right now, this CSS editor [only works](https://caniuse.com/css-cascade-scope) in stable Chrome and Safari Technology Preview. But I believe it will work in Firefox [soon](https://bugzilla.mozilla.org/show_bug.cgi?id=%40scope).
