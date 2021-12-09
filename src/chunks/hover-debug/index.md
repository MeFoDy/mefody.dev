---
title: Inspect the ninja element available on hover or focus
description: Three ways to debug some element that is displayed on hover or focus.
cover: images/cover.png
date: 2021-12-09
dateUpdated: Last Modified
tags:
    - devtools
    - chunk
---

{% import "macros.njk" as macros with context %}

Sometimes you have a task to debug some element that is displayed on hover or focus. But it hides when clicked outside the viewport. For example, when you click somewhere in DevTools.

So, how to debug such ninja elements? Let’s use Chrome DevTools possibilities for that.

## Toggle element state

The most general solution is to choose `:hover` state in the Toggle Element State panel.

<figure >
    {{ macros.img('./images/toggle-state.png', 'Toggle Element State panel in DevTools.') }}
    <figcaption>
        It is hidden under the `:hov` button in a Styles drawer.
    </figcaption>
</figure>

Let’s see it in action.

<figure >
    {{ macros.video('./images/netlify@1440', 1440, 900, true, false) }}
    <figcaption>
        Just use `:hover` toggler.
    </figcaption>
</figure>

Unfortunately, in many cases, enabling pseudo-classes is not enough.

## Emulate a focused page

For pages that use JavaScript to toggle a focused state you can try to emulate focus on a page. Did you know that you can call a Command Menu with <kbd>Ctrl Shift P</kbd> (<kbd>⌘ ⇧ P</kbd> for macOS)? It has a command `Emulate a focused page` that can help us with our issue.

<figure >
    {{ macros.img('./images/emulate-focus.png', 'Command Menu in DevTools with `focu` typed.') }}
    <figcaption>
        It is also available with “Run command” command :)
    </figcaption>
</figure>

Let's see it in action.

<figure >
    {{ macros.video('./images/yandex@1440', 1440, 900, true, false) }}
    <figcaption>
        Perfect case!
    </figcaption>
</figure>

## Break on attribute modifications

In some very strange cases, the hover state is set with JavaScript. And it is difficult to debug such cases because JS doesn’t handle a focus state. But we have a “hammer” for that.

<figure >
    {{ macros.img('./images/break-on.png', '"Break on..." menu in DevTools.') }}
    <figcaption>
        Right Click on a DOM-element, Break on..., attribute modifications.
    </figcaption>
</figure>

When the class attribute of the element is changed, we’ll have a JavaScript breakpoint triggered.

Let’s see it in action.

<figure >
    {{ macros.video('./images/amazon@1440', 1440, 900, true, false) }}
    <figcaption>
        The debugger freezes the page, so you can easily inspect all the elements.
    </figcaption>
</figure>

## Materials

- [Inspect an element shown on hover](https://getfrontend.tips/inspect-an-element-shown-on-hover/)
- [Run commands in the Command Menu](https://developer.chrome.com/docs/devtools/command-menu/)
