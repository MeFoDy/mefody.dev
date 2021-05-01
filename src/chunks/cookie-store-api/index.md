---
title: Work with cookies the modern way
description: Cookie Store API is a way to avoid the pain.
cover: images/cover.png
date: 2021-05-01
dateUpdated: Last Modified
tags:
    - js
---

Have you ever worked with cookies? Did you find working with them obvious? I think it has a lot of nuances for newbies.

## document.cookie

Let’s take a look at the classic way to work with cookies. We’ve had cookies in the specification since 1994, [thanks to Netscape](https://curl.se/rfc/cookie_spec.html). Netscape implemented `document.cookies` [in 1996](https://www.erikoest.dk/cookies.htm) in their Netscape Navigator. Look at this definition of a cookie from those days.

> A cookie is a small piece of information stored on the client machine in the `cookies.txt` file.

You can even find the chapter about `document.cookie` in the [“Javascript. The Definitive Guide. Second Edition, January 1997”](https://www.cs.ait.ac.th/~on/O/oreilly/web/jscript/refp_79.htm). 24 years ago. And we are still using that old way to work with cookies because of backward compatibility.

So, what’s the way?

### Get cookies

```js
const cookies = document.cookie;
// returns "_octo=GH1.1.123.456; tz=Europe%2FMinsk" on GitHub
```

Yeah, that’s it. It returns a string with all cookies separated by `;`.

Hot to get a single cookie value? Right, split the string manually.

```js
function getCookieValue(name) {
    const cookies = document.cookie.split(';');
    const res = cookies.find(c => c.startsWith(name + '='));
    if (res) {
        return res.substring(res.indexOf('=') + 1);
    }
}
```

How to get some cookie expiration date? No way.

How to get some cookie domain? No way.

You can parse the HTTP `Cookie` header if you want.

### Set cookies

```js
document.cookie = 'theme=dark';
```

It creates the cookie named `theme` with the value equals `dark`. Ok, does it mean that `document.cookie` is a string? Nope. It’s a setter.

```js
document.cookie = 'mozilla=netscape';
```

It doesn’t rewrite the old cookie named `theme`, it creates the new one named `mozilla`. Now you have two cookies.

By default, a created cookie expires when the browser is closed. You can set the expiration date.

```js
document.cookie = 'browser=ie11; expires=Tue, 17 Aug 2021 00:00:00 GMT';
```

Yeah, right, that’s what I want, calculate the expiration date in GMT format every time I want to set a cookie. Ok, let’s write some more JavaScript.

```js
const date = new Date();
date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); // love it
document.cookie = `login=mefody; expires=${date.toUTCString()}; path=/`;
```

Fortunately, we have another option to set the cookie expiration.

```js
document.cookie = 'element=caesium; max-age=952001689';
```

The `max-age` part is a lifetime of a cookie in seconds and it has more priority than the `expires` part.

Don’t forget about `path` and `domain`. By default, the cookie is set for the current location and the current host. If you need to set the cookie for the entire domain, add `; path=/; domain=example.com`.

### Delete cookies

```js
document.cookie = 'login=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
```

To delete the cookie you should set its expiration date to some past date. To be sure that it will be deleted, use the Unix epoch start.

### Service Workers

No. Just no. Working with `document.cookie` is a synchronous operation, so you can’t use it in service workers.

## Cookie Store API

There is a draft of an awesome API that can help us to avoid a lot of pain in the future. It’s [Cookie Store API](https://wicg.github.io/cookie-store/).

Firstly, it’s an async API. It means you can use it without blocking the main thread. And service workers can use them too.

Secondly, it’s more clear for understanding.

### Get cookies

```js
const cookies = await cookieStore.getAll();
const sessionCookies = await cookieStore.getAll({
    name: 'session_',
    matchType: 'starts-with',
});
```

The method `getAll` returns an array, not a string. That’s what I expect when I try to get a list of something.

```js
const ga = await cookieStore.get('_ga');
/**
{
    "domain": "mozilla.org",
    "expires": 1682945254000,
    "name": "_ga",
    "path": "/",
    "sameSite": "lax",
    "secure": false,
    "value": "GA1.2.891784426.1616320570"
}
*/
```

Whoa! I can get the expiration date, domain and path info without hacks!

### Set cookies

```js
await cookieStore.set('name', 'value');
```

or

```js
await cookieStore.set({
    name: 'name',
    value: 'value',
    expires: Date.now() + 86400,
    domain: (new URL(self.location.href)).domain,
    path: '/',
    secure: (new URL(self.location.href)).protocol === 'https:',
    httpOnly: false,
});
```

Love this syntax!

### Delete cookies

```js
await cookieStore.delete('ie6');
```

Or you can set the expiration date to the past date if you want, but what for?

### Cookie events

```js
cookieStore.addEventListener('change', (event) => {
    for (const cookie in event.changed) {
        console.log(`Cookie ${cookie.name} changed to ${cookie.value}`);
    }
});
```

Yeah, you will have a possibility to subscribe to cookies changes without thread blocking polling. Fantastic!

### Service Workers

```js
// service-worker.js

await self.registration.cookies.subscribe([
    {
        name: 'cookie-name',
        url: '/path-to-track',
    }
]);

self.addEventListener('cookiechange', (event) => {
    // process the changes
});
```

## Can I use it right now?

Be careful, but [you can](https://caniuse.com/cookie-store-api). The Cookie Store API works in Chrome 87+ (Edge 87+, Opera 73+). For other browsers, you can use [the polyfill](https://www.npmjs.com/package/cookie-store) that doesn’t return the full cookie info as an original API. Progressive enhancement is the thing.

Keep in mind that this API specification is still in “Draft Community Group Report” status. But if your DX is an important thing for the project, try the modern way.

## Sources

- [Netscape cookies](https://www.erikoest.dk/cookies.htm)
- [Cookie Store API Spec](https://wicg.github.io/cookie-store/)
- [Cookie Store API Explainer](https://wicg.github.io/cookie-store/explainer.html)
- [Chrome Status: Cookie Store API](https://www.chromestatus.com/feature/5658847691669504)
- [MDN: Cookie Store API](https://developer.mozilla.org/en-US/docs/Web/API/Cookie_Store_API)
