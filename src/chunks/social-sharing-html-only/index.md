---
title: Social media buttons without JavaScript
description: How to create sharing links for popular social networks.
cover: images/cover.png
date: 2021-04-05
dateUpdated: Last Modified
tags:
    - html
    - chunk
---

You don’t need JavaScript to add social media buttons to your website. But I see JavaScript-based social buttons on websites every day. And these buttons are not about privacy. Let’s see how to create such buttons using `<a href="...">`.

## Twitter

```html
<a href="https://twitter.com/intent/tweet?text=Awesome+article&url=https%3A%2F%2Fmefody.dev&hashtags=html,css&via=dev_tip" target="_blank">
    Share on Twitter
</a>
```

Parameters:
- `text` — tweet text. It should be URL-encoded. I prefer to use `+` for spaces.
- `url` — the page URL. Should be URL-encoded too.
- `hashtags` — obviously. Separated by comma.
- `via` — your twitter username without `@`.

The complete text of the tweet will be `Awesome article https://mefody.dev #html #css via @dev_tip`.

[Documentation: Tweet button](https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent)

## Facebook

```html
<a href="https://www.facebook.com/sharer.php?u=https://mefody.dev" target="_blank">
    Share on Facebook
</a>
```

Parameters:
- `u` — the page URL.

Unfortunately, the Facebook sharer no longer supports any customization. If you need custom text, try to use Dialog for that:

```html
https://www.facebook.com/dialog/share?app_id=42&display=popup&href=https%3A%2F%2Fmefody.dev
```

But this way requires `app_id`, so you have to register your Facebook app. Not very friendly.

[Documentation: Facebook Share](https://developers.facebook.com/docs/sharing/reference/share-dialog)

## VK

```html
<a href="http://vk.com/share.php?url=https://mefody.dev" target="_blank">
    Share in VK
</a>
```

Parameters:
- `url` — the page URL.

[Documentation: VK Link Posting](https://vk.com/dev/widget_share)

## LinkedIn

```html
<a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fmefody.dev" target="_blank">
    Share in LinkedIn
</a>
```

Parameters:
- `url` — the page URL.

[Documentation: Share Plugin](https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/plugins/share-plugin)

## Attributes

I also add these attributes to my share links:
- `target="_blank"` to open the link in a new window.
- `rel="noopener"` to reset `window.opener`.
