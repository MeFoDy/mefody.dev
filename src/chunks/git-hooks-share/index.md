---
title: 'Git Hooks: share with your team'
description: How to share git hooks with your team? How can I make my automation from .git/hooks public?
cover: images/cover.jpg
date: 2021-08-15
dateUpdated: Last Modified
tags:
    - git
    - npm
    - bash
    - chunk
---

In my previous [chunk](/chunks/git-hooks/) I showed the way to make development in your repo more productive. But there was a good question unsolved: "How to share git hooks with your team?" By default, all your `.git` files are local — they are not for being pushed. So how can I make my automation from `.git/hooks` public?

## README.md

You can add a chapter to the `README.md` file with instructions on setting up git hooks locally. With links to gists or something like that. But this way is not the true way.

## npm prepare

There is a way to add some automation to your package after `npm install` run. Npm has useful [lifecycle scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts) that can help you. The `prepare` script looks really suitable for our task to install git hooks on a local machine.

```json
{
    "scripts": {
        "prepare": "bash ./copy-hooks.sh"
    },
}
```

But you still need to write your `copy-hooks.sh` script. Not a good way for frontend beginners.

## Separate folder

To make git hooks a part of a repository, you can just move them to a separate folder. For example, to `.githooks` or `.config/githooks`. But you still need to have some steps that will make these hooks executable.

Git can help you with it. Command `git config core.hooksPath .config/githooks` tells your local git to use `.config/githooks` as a folder with hooks. Pretty simple.

```json
{
    "scripts": {
        "prepare": "git config core.hooksPath .config/githooks"
    },
}
```

Konstantinos Leimonis [proposes](https://www.smashingmagazine.com/2019/12/git-hooks-team-development-workflow/) another trick with symlinks.

```bash
find .git/hooks -type l -exec rm {} \\;
find .githooks -type f -exec ln -sf ../../{} .git/hooks/ \\;
```

This code links scripts from `.githooks` folder to `.git/hooks/`. So when git tries to call some hook from its default directory it will execute the hook from your separate directory.

## Git hooks managers

There is a lot of projects that can help you to avoid bash learning if you just want to use web technologies for development. My favorite tools are:

- [husky](https://github.com/typicode/husky) — hooks manager on steroids with a big community. It is lightweight and MIT licensed in the stable version. I use it in my work projects.
- [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) — hooks manager for small-sized projects. I use it in my blog repo.

With these managers, you don't need to write any bash scripts, but you can. And their auto-installation is still simple. My `package.json` looks like this:

```json
{
    "scripts": {
        "prepare": "npx simple-git-hooks"
    },
    "simple-git-hooks": {
        "pre-push": "npm run lint"
    }
}
```

Honestly, you don't need all this `prepare` stuff for `simple-git-hooks` because it uses its own `postinstall` script and makes all the automation by itself. Husky had such automation before, but they [decided](https://blog.typicode.com/husky-git-hooks-autoinstall/) to change the behavior.

## Resources

- [npm scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts)
- [How To Ease Your Team’s Development Workflow With Git Hooks](https://www.smashingmagazine.com/2019/12/git-hooks-team-development-workflow/)
- [Husky docs](https://typicode.github.io/husky/)
