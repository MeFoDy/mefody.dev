---
title: 'Using a browser as WYSIWYG'
date: 2021-03-21
dateUpdated: Last Modified
tags:
    - js
    - devtools
    - chunk
---

{% import "macros.njk" as macros with context %}

Sometimes I need to take a screenshot of a page with some text changed. Of course, I can do it with DevTools. Just need to open DevTools, select the DOM-element with the text, right-click, “Edit as HTML”, make my changes, profit! But is there any simpler way?

## designMode

You can set `document.designMode` to `'on'` and your page becomes editable. See it in action.

<figure >
    {{ macros.video('./images/designmode', 1209, 662) }}
    <figcaption>
        Type <code>document.designMode = 'on'</code> in DevTools Console and you can start editing the page content like in MS Word.
    </figcaption>
</figure>

If you need to add an extra line break, use <kbd>Shift Enter</kbd> for that.

[designMode on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/designMode)

## contenteditable

There is another option to enable editing of the page. You can add the attribute `contenteditable` to a DOM-element. If you add it to the `<body>` the whole page is editable. Or you can add it using JavaScript.

```js
document.documentElement.contentEditable = true;
```

[contenteditable on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)

## Bookmark

It’s not really effective to make the changes above via console every time. So I use bookmarks for these purposes.

I need something like a toggle.

```js
(function(){
    document.designMode = document.designMode === "off" ? "on" : "off";
})()
```

Then I can just add this code to bookmarks with `javascript:` inserted before.

<figure >
    {{ macros.img('./images/bookmark.png', 'Adding bookmark to Chrome Bookmarks') }}
    <figcaption>
        <p>Chrome: Bookmarks > Bookmarks Manager > Add new bookmark</p>
        <p>Firefox: Bookmarks > Show all bookmarks > New bookmark...</p>
    </figcaption>
</figure>


Full bookmark snippet is `javascript:(function(){document.designMode=document.designMode==="off"?"on":"off"})()`
