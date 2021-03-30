---
title: GitHub from CLI
description: How to work with GitHub issues, pull requests, and gists from the terminal.
cover: images/cover.png
date: 2021-03-31
dateUpdated: Last Modified
tags:
    - bash
    - git
    - chunk
---

I love open source. GitHub has a really great UI for managing open source projects in a browser. But what if I want to manage a project right in my terminal?

I have been using the GitHub CLI for half a year and it has boosted my productivity a lot. Let’s talk about typical cases.

To get started with the GitHub CLI, you need the `gh` package to be installed. Use `brew install gh` or check [the official installation guide](https://github.com/cli/cli#installation).

## Issues

Imagine a situation when you forked some project to make it better. Suddenly, you encounter a bug that is not related to the changes you made. What should you do to fix it? Open a browser, find a repo, open issues, create a new one, fill it with details...

Or you can enter a simple command into the terminal.

```bash
gh issue create # will ask you for the title and body
```

If you prefer Web UI, add `--web` as an option.

```bash
gh issue create --web # will open the issue creation page
```

## Pull Requests

What do you do when you need to check a pull request made by another developer? Find the fork url, add a new upstream, fetch the branch with changes, checkout...

Or you can get the id of a pull request (it’s `42` for the url `github.com/owner/repo/pull/42`) and use it as an option for `gh pr`.

```bash
gh pr checkout 42
```

Ok, we have the necessary changes. What’s next? Code review!

Yeah, `gh` still doesn’t allow you to leave a comment on certain lines of code. But if you just need to approve the PR or request any changes, do it from the terminal.

```bash
gh pr review --approve --body "LGFM"
# or
gh pr review --request-changes --body "Wanna more emojis"
```

Let’s merge the PR if it’s OK.

```bash
gh pr review --approve --body "Looks great, thank you!"
gh pr merge --squash --delete-branch
```

Of course, you can also open the pull request page via terminal.

```bash
gh pr view --web
```

What if I want to propose my changes to the project? I can do it through the web interface, but it takes too many clicks. I can use the link that git prints for me when I push the branch, it’s faster. But the fastest way is to create PR with `gh`.

```bash
gh pr create # will ask you for the title and body
# or
gh pr create --web # will open the PR creation page
```

## Gists

Sometimes I need to share some code snippets with my colleagues. [Gist](https://gist.github.com/) makes it simple. And you can create gists with `gh`.

```bash
cat awesome.js | gh gist create # private by default
```

## Sources
- [GitHub CLI: Manual](https://cli.github.com/manual/)
