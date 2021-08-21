---
title: 'Tell about the website creators using humans.txt'
description: If you want to add info about all the website creators, you can add the file humans.txt to the site root.
cover: images/cover.jpg
date: 2021-08-21
dateUpdated: Last Modified
tags:
    - html
    - git
    - chunk
---

I check the analytics of this blog every week, especially the 'Top resources not found' section. Just to be sure that I have no broken links. This week, I found strange requests to the `/humans.txt` file. I've added `/robots.txt` before, but why somebody tries to open `/humans.txt`?

## We are people, not machines

I found the answer on [humanstxt.org](https://humanstxt.org/). It's a really cool initiative to add info about all the creators of the website.

> We are always saying that, but the only file we generate is one full of additional information for the searchbots: robots.txt. Then why not doing one for ourselves?

And that's true. So I've added [such file](/humans.txt) to my blog.

Also, I found a lot of websites that already use the file in different ways.

- Google added `humans.txt` to their domain [almost ten years ago](http://googlesystem.blogspot.com/2011/05/googles-humanstxt-file.html).
- GitHub redirects requests to this file to their 'About' page.
- Evil Martians made redirect from `humans.txt` to `martians.txt` with the same format.

## How to?

1. Add the file `humans.txt` to the root of your site.
2. Add info about all the site creators to this file.
3. Add `<link rel="author" href="/humans.txt">` to the `<head>`.

**Read more:** [humans.txt: Quick start](https://humanstxt.org/Standard.html)

## Automation

I want to keep the section `/* THANKS */` with the list of all contributors actual. So I've added some automation to update the list on every local build:

1. Get data from `git shortlog -sne`. `s` is for summary only, `e` is for contributors emails, `n` is for the number of commits.
2. Remove contributors with my emails from the list.
3. Save the list to data file.
3. Put the list to `humans.txt` on every build.

[Source code](https://github.com/MeFoDy/mefody.dev/blob/main/gulpfile.js).

## Resources

- [Humans TXT: We Are People, Not Machines.](https://humanstxt.org/)
