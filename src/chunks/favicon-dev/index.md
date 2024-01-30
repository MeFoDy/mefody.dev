---
title: Different favicon for development build
description: How to make tabs in the browser always show which build you’re working on.
cover: images/cover.jpg
date: 2024-01-30
dateUpdated: Last Modified
tags:
    - html
    - js
    - svg
    - chunk
---

{% import "macros.njk" as macros with context %}

It’s really annoying when you spend a lot of time trying to catch a bug in the local build when, in fact, you’ve been looking at the production version the whole time.

When coding, I usually have several versions of the website open: the production version, the local version, and the version on the testing stage. When they all have the same title and the same favicons, it can be confusing.

<figure >
    {{ macros.img('./images/same-tabs.jpg', 'Three tabs in browser look the same.') }}
    <figcaption>
        Ok, where are you?
    </figcaption>
</figure>

It will be handy if the tab in the browser looks different for different builds. And I can change the favicon, can’t I?

<figure >
    {{ macros.img('./images/different-tabs.jpg', 'Three tabs in browser. The second tab has different favicon.') }}
    <figcaption>
        Here you are!
    </figcaption>
</figure>

## The simplest favicon

Lea Verou [twitted](https://twitter.com/LeaVerou/status/1241619866475474946) a modern way to make a minimalistic emoji favicon.

```html
<svg xmlns="http://w3.org/2000/svg" viewBox="0 0 100 100">
    <text y=".9em" font-size="90">🍉</text>
</svg>
```

That’s it. Simple, three lines of code, working.

This is handy for three reasons:

1. It’s easy to update.
2. You can make numerous different favicons.
3. They look equally good in light and dark themes.

Ok, now just save your favorite emoji to `favicon_dev.svg`.

## Add the favicon to the project

There are several options here.

### Build

Most likely, you have a website build script. So, at build time, you can throw an environment variable to the builder.

```json
{
    "scripts": {
        "build": "eleventy && gulp build",
        "build:prod": "ELEVENTY_ENV=production npm run build",
        "build:dev": "ELEVENTY_ENV=development npm run build",
    }
}
```

My blog is built using Gulp (yeah, yeah, and what are you going to do to me, I’m in another city). I would make this kind of replacement at build time.

```js
var gulp = require('gulp');
var replace = require('gulp-replace');

gulp.task('favicon', function() {
    if (process.env.ELEVENTY_ENV === 'production') {
        return new Promise((resolve) => resolve());
    }

    return gulp
        .src(`${PUBLIC_PATH}/**/index.html`)
        .pipe(replace(
            /<link rel="icon" href="\/favicon\.ico">/g,
            '<link rel="icon" href="/favicon_dev.svg" type="image/svg+xml">'
        ))
        .pipe(gulp.dest(PUBLIC_PATH));
});
```

#### Templating language

My blog is a static site. There is Eleventy under the hood. The page templates are written using the [Nunjucks](https://mozilla.github.io/nunjucks/). Here’s how to teach Eleventy to swap out the favicon.

1. Place environment variables into the [data cascade](https://www.11ty.dev/docs/data-cascade/).

```js
// file: src/data/isdevelopment.js

require('dotenv').config();

module.exports = function() {
    return process.env.ELEVENTY_ENV === 'development';
};
```

2. Use the variable in your header template.

```html
{% raw %}{% if isdevelopment %}{% endraw %}
    <link rel="icon" href="/favicon_dev.svg" type="image/svg+xml">
{% raw %}{% else %}{% endraw %}
    <link rel="icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/images/favicon/favicon-180.png">
{% raw %}{% endif %}{% endraw %}
```

### Client

You can move the logic of changing the favicon to the client.

```js
if (location.hostname === "localhost" ||
    location.hostname === "127.0.0.1") {
    const faviconEl = document.querySelector('link[rel=icon]');
    faviconEl.setAttribute("href", "/favicon_dev.svg");
    faviconEl.setAttribute("type", "image/svg+xml");
}
```

## Sources

- [Different Favicon for Dev and Prod](https://strawberrycode.com/blog/favicon-dev-prod/)
- [How to Favicon in 2024: Six files that fit most needs](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)
