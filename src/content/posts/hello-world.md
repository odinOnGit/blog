---
title: hello, world
date: 2026-09-30
summary: just a structure of how each blog will look like
cover: /images/cover.svg
tags: meta, guide
attachments: sample.pdf, notes.txt
---

Welcome. Every `.md` file in `src/content/posts` becomes a post. This one shows what you can use.

## Images and GIFs

Put files in `public/images` and reference them. The text in the square brackets becomes a caption. Click any image to enlarge it.

![A cover image, click to enlarge](/images/cover.svg)

![A looping GIF works the same way](/images/motion.gif)

## Text, quotes and code

> A good blog post is a conversation you have with one person, in public.

Use **bold**, *italics*, [links](https://example.com) and lists:

- Short paragraphs read better on phones
- One idea per section

```js
const greet = (name) => `Hello, ${name}`;
```

| Item | Where it goes |
|------|---------------|
| Images and GIFs | `public/images` |
| Attachments | `public/files` |

## Attachments

List file names under `attachments:` at the top of the post. They appear below with preview and download buttons.
