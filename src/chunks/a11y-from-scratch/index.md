---
title: 'Accessible components from scratch'
description: Recently, my colleagues asked me to create a small checklist for making an accessible component from scratch. Here it is.
cover: images/cover.jpg
date: 2021-11-15
dateUpdated: Last Modified
tags:
    - html
    - a11y
    - chunk
---

Recently, my colleagues asked me to create a small checklist for making an accessible component from scratch. Here it is.

## Why do I need to make something accessible?

Do you have a perfect vision? Will it be perfect forever?

Have you had your hand broken sometime? Arm dislocation, maybe? Cut your finger? How was it to use websites?

Did you have a broken mouse sometime? Broken touchpad? Imagine that your touchpad is broken, and you need to find some repair service to fix it, but your phone is discharged, and the search page is made the way you can’t follow the link using the keyboard. Good luck!

We (developers) still do not know how to calculate the lost profit. Anatoly Popko (my blinded colleague from Yandex) said that he wants to spend his money using some services but the services don’t want to get his money just because their functionality is inaccessible.

When we make our websites comfortable for people with disabilities, we make these sites very comfortable for us.

## How can people use your site?

— *With a screenreader.* The website is voiced by a screenreader. It’s useful for blinded people.
— *With keyboard.* There is a possibility to use website without mouse, using <kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd> and arrows. It’s useful for people with locomotor system disabilities or somebody who just want to use a keyboard.
— *With a mouse.* It’s useful for people who can’t use a keyboard.
— *With zoom.* Just because I have poor eyesight.
— *With contrast.* For people with color blindness.
— *Without animations.* For people with epilepsy.
— *With left hand.* For left-handed persons.

## How to make the component accessible?

1. **Use ready-made solutions.** You are not the first person who wants to make an accessible component. Smashing Magazine has an [awesome article](https://www.smashingmagazine.com/2021/03/complete-guide-accessible-front-end-components/) with many links about the a11y.
2. **Use semantic tags.** Screenreader will do all the job if you have `nav`, `ul`, `button`, `a`, `dialog`, etc. It can’t do the same if you use `div` and `span` only.
3. **Use ARIA.** If you can’t solve your task with semantic tags only. But please, try point 2 first.
4. **Do not use tiny interactive elements.** Try to touch some tiny `5×5` button to close some adv popup. It enrages! Use `44px` as a minimum dimension for any interactive element, it’s enough for fingers.
5. **Link `<a>` should have some text inside it.** Screenreader reads the URL if it hasn’t. Let me guess, you don’t have readable URLs for all your links, have you? If your links don’t have texts by design, add `<span class="visibility-hidden">Text</span>` for that. But try to talk to your designer first.
6. Do you have the web-app state recoverable by URL? It’s an `<a>` link. Haven’t you? It’s a `<button>`.
7. **Don’t use only icons for buttons or links.** Add some hidden `span` or `aria-label` to give that element a text. Talk to your designer to make the element better. Not every person understands your icons, but almost everybody understands the text.
8. **Add `alt` to your images.** Blind people want to read them too. Can’t you do that? Use `alt=""` to hide the image from screenreader. It will announce the URL if you haven’t an `alt` attribute. Let me guess, you don’t have readable URLs for all your images, have you?
9. **Don’t hide visual focus.** If you don’t like the default style of a focus, make your own custom styles. Explain to your designer, that you can’t hide the focus. If they argue with you, add the `cursor: none` to their Firgma workspace to explain it more clearly.
10. **Trap the focus inside the modal.** The focus shouldn’t move outside.
11. **Move the focus inside the modal on its opening.**
12. **Return the focus back** when the modal is closed.
13. **Don’t use only the colors** to create some difference. If you use red to mark errors and green to mark success messages, somebody sees *some* color to mark *something*... Add icons, text, underlines instead. Why in general we use red color to mark something dangerous, huh?
14. **Use captions for videos.** Don’t use videos with forced subtitles, they can’t be translated.
15. **Use `prefers-*` media features.** For example, `prefers-reduced-motion` or `prefers-contrast`. If I’ve set such an option for my OS, I have some reasons for that.
16. **Don’t use tiny font size.** It’s annoying. I can’t see tiny texts. If your designer decided to use `10px` as a font-size, make his Figma workspace *better* with `font-size: 5px !important` everywhere. But try to talk with them first.
17. **Don’t try too hard.** Make your general scenarios work first. If your ’BUY’ button doesn’t work, it makes no sense to add perfect captions to all the images on a page. Fix the main scenario first.
18. Don’t use `Button` text inside the `<button>`. All the roles are read by the screenreader by default.

## Resources

- [A Complete Guide To Accessible Front-End Components](https://www.smashingmagazine.com/2021/03/complete-guide-accessible-front-end-components/)
