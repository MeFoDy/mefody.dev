---
title: How to copy part of a long link text
description: Have you ever wanted to select and copy some part of a long link text?
cover: images/cover.png
date: 2021-04-08
dateUpdated: Last Modified
tags:
    - browser
    - chunk
---

{% import "macros.njk" as macros with context %}

Have you ever wanted to select and copy some part of a long link text? Not the full text, just a specific part in the middle.

<figure >
    {{ macros.video('./images/select-fail@1000', 1000, 640, true, true) }}
    <figcaption>
        It’s a real pain.
    </figcaption>
</figure>

Did you know that you can hold an <kbd>Alt</kbd> (<kbd>⌥</kbd> for macOS) to make you happy with it?

<figure >
    {{ macros.video('./images/select-success@1000', 1000, 640, true, true) }}
    <figcaption>
        Just hold an <kbd>Alt / ⌥</kbd> and select the needed part of a link text.
    </figcaption>
</figure>

Works in Chrome (Edge, Opera, Yandex Browser) and Firefox.
