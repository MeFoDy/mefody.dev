---
title: Link to download
description: A simple way to create a link to save the file.
cover: images/cover.png
date: 2021-06-17
dateUpdated: Last Modified
tags:
    - html
    - js
    - chunk
---

Sometimes I need to create a link that should show a system dialog to save the file. Browsers are pretty smart to open that dialog for some binaries, e.g. for archives or `*.exe`. But what if I want to download an image or some video?

## `Content-Disposition` header

The most valid way is to add a `Content-Disposition` header on the server.

```html
Content-Disposition: attachment; filename=kitten.jpg
```

When your browser finds the `attachment` value, it starts to download the file, not to show it.

But sometimes you can’t change any server configs, so we need a more browserish way to solve the problem.

## `download` attribute

The easiest way to do this is to add the `download` attribute to your link.

If you just add it without any value, your browser will try to get the name of the file from its `Content-Disposition` header (yeah, it has high priority) or its path.

```html
<a href="images/kitten.jpg" download>
    <img src="images/kitten-preview.jpg" alt="Kitten photo preview">
</a>
```

Try it: <a href="./demo/kitten-pixel.jpg" download>demo link</a>.

You can set some value to `download` if you want to change the default name. It can help when you have some strange auto-generated URL like `https://cdn/images/a1H5-st42-Av1f-rUles`.

```html
<a href="images/1h24v9lj.jpg" download="kitten">
    Download
</a>
```

Try it: <a href="./demo/kitten-pixel.jpg" download="i-am-tiny">demo link</a>.

**Important!** All this attribute magic [is not for cross-origin links](https://www.chromestatus.com/feature/4969697975992320). You can’t control the stuff from cross-origin sources due to security issues.

And remember that IE and old Safari are unaware of `download`. [Check it](https://caniuse.com/download).

## `blob:` and `data:`

Another lifehack to help your users save pictures of kittens in a format convenient for them. If you use AVIF or WebP images on your site, it is a huge chance that no one will be able to save them on their computer or phone to view them later. More precisely, they can save the image, but they can’t view it. Very sad.

To help them, use `data:` or `blob:` URLs inside the `href` attribute.

**Step 1.** Draw the image on a canvas.

```js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const image = new Image();
image.onload = function () {
    ctx.drawImage(image, 0, 0);

    // TODO: put the magic here
};
image.src = 'kitten-170.avif';
```

**Step 2a.** Save the image as a blob to the link `href`.

```js
const blobLink = document.getElementById('blob-link');

canvas.toBlob(blob => {
    const blobUrl = URL.createObjectURL(blob);
    blobLink.href = blobUrl;
}, 'image/jpeg', 0.9);
```

Yes, I can save AVIF as JPEG. Cool, right? The user downloaded just 4 KB AVIF from a server and got his 13 KB JPEG on a client!

**Step 2b.** Save the image as a data to the link `href`.

Some browsers can’t use blobs, so you can help them with data-urls.

```js
const dataLink = document.getElementById('data-link');

dataLink.href = canvas.toDataURL('image/jpeg', 0.9);
```

It’s even easier, but not so performant.

You can play with the full demo here:
- [Demo](./demo/index.html)
- [Source code](https://github.com/MeFoDy/mefody.dev/blob/main/src{{ page.url }}demo/index.html)

## Sources

- [Wiki: Content-Disposition](https://en.wikipedia.org/wiki/MIME#Content-Disposition)
- [MDN: A](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/A)
- [MDN: canvas.toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)
- [MDN: canvas.toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
