---
title: 'Git Hooks: let the machine do all the routine'
description: I wanna live in a world where every commit is a project state in which everything is fine. Fortunately, I can configure my projects to use git hooks to help contributors to avoid mistakes.
cover: images/cover.jpg
date: 2021-07-27
dateUpdated: Last Modified
tags:
    - git
    - npm
    - bash
    - chunk
---

I wanna live in a world where every commit is a project state in which everything is fine: linters are green, dependencies are up-to-date, git history is clear, etc. Fortunately, I can configure my projects to use git hooks to help contributors to avoid mistakes.

## Git hooks basics

Git hook is a snippet triggered when the git executes something. For example, if you have a strict rule *"No tabs for indentation"*, you can create a hook that checks all the changed files to satisfy the rule. Git will run this check and stop the action (push, commit), if the rule has been ignored by some impudent contributor.

There are many git actions you can interfere with:

- **pre-commit**
- pre-merge-commit
- **prepare-commit-msg**
- commit-msg
- post-commit
- pre-rebase
- **post-checkout**
- post-merge
- **pre-push**
- etc.

You can find more information about all existing git hooks [here](https://git-scm.com/docs/githooks).

To set up a hook, you should create an executable file in the `.git/hooks` directory named according to the spec.

Let's create a simple hook that runs linters on every `git push`. It will help to keep the repo clean.

```bash
cd .git/hooks # go to the hooks directory
vi pre-push # create or edit the hook
```

Paste the following code to the file.

```bash
#!/bin/sh
npm run lint
```

Pretty simple, right? This hook just runs a custom npm script from your `package.json`. You can use [my config](https://github.com/MeFoDy/mefody.dev/blob/main/package.json) as an example.

Save, exit, commit, profit!

**Note:** it's important to make the hook file executable. The magic will not happen without it.

```bash
chmod +x pre-push # make the file executable
```

## Useful git hooks

If you know bash language a little, you can add many useful git hooks to your project.

Of course, you can use not only bash for your git hooks. It can be everything executable, like Python or even JS. But remember that bash is preinstalled and can be run on most environments, whereas other languages should be installed and configured before their usage. So I prefer bash.

Check these projects to have inspiration:

- [aitemr / awesome-git-hooks](https://github.com/aitemr/awesome-git-hooks)
- [compscilauren / awesome-git-hooks](https://github.com/compscilauren/awesome-git-hooks)

### Put the Task ID to commit messages

If your team decided to use task ids from the task tracker (JIRA, Wrike, whatever else) in commit messages, create a `prepare-commit-msg` file in the `.git/hooks` directory and paste the following code there.

```shell
#!/bin/sh

# .git/hooks/prepare-commit-msg

COMMIT_MSG=$(cat $1)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TASK_ID_REGEX="[A-Z]+-[0-9]+" # corresponds to JIRA-123 or SERP-666
TASK_ID_FROM_CURRENT_BRANCH=$(echo "$CURRENT_BRANCH" | grep -Eo "$TASK_ID_REGEX")

if [ ! -z "$TASK_ID_FROM_CURRENT_BRANCH" ]; then
    echo "$TASK_ID_FROM_CURRENT_BRANCH: $COMMIT_MSG" > $1
fi
```

It parses your branch name, and if the name contains something looking like the task ID, the hook prepends this ID to the commit message. For example, if you have the branch named `AREA-51` and your commit message is `Find UFO`, the final commit message will be `AREA-51: Find UFO`.

You can make this hook much smarter like [here](https://github.com/aitemr/awesome-git-hooks/blob/master/prepare-commit-msg/prepare-commit-msg-jira).

### Get notified about new dependencies after checkout

Paste the following code to the `.git/hooks/post-checkout`.

```shell
#!/bin/sh

# .git/hooks/post-checkout

PREV_COMMIT=$1
POST_COMMIT=$2

if [ -f package-lock.json ]; then
    if ! git diff --quiet $PREV_COMMIT..$POST_COMMIT -- package-lock.json; then
        echo "'package-lock.json' has been changed. Please, run 'npm ci' to update dependencies."
    fi
fi
```

You can make it more colourful and even let it running `npm ci` automatically like [here](https://gist.github.com/lyrixx/5867424). But I don't like when my tools install something without my permission.

### Disable direct commits to the `main` branch

It's a common pattern to have no direct commits to the `main` branch. Let your CI do all the thing. Of course, you must configure your repository to avoid such situation, but it's ok to add more confidence with an extra check on a git level.

Paste the following code to the `.git/hooks/pre-push`.

```shell
#!/bin/sh

# .git/hooks/pre-push

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" = "main" ]; then
    echo "YOU SHALL NOT PASS!\nDear $USER, you don't want to commit directly to the 'main' branch ;)"
    exit 1
fi
```

**Note:** it's important to keep `exit 1` in the code to stop the push.

I found a cool example of public alerting about the accident [here](https://www.notion.so/e7682478b8927700c714f12e37f0837e). But you should be sure all your teammates are ok with such sort of blaming.

## `simple-git-hooks` with `lint-staged`

If your project is small and you don't need complicated hooks with dozens of checks, try to use a lightweight library [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks). It has some limitations but its possibilities are enough for my opensource projects.

I use the next flow:

1. Run linters on staged files before commit and fix the files automatically if it's possible.
2. Run linters on all files before push.

To work with staged changes only I use another useful library [lint-staged](https://github.com/okonet/lint-staged).

Let's configure the project to implement the flow. Firstly, install the packages.

```bash
npm install --save-dev simple-git-hooks lint-staged
```

Then add a configuration to your `package.json`.

```json
{
    "scripts": {
        "lint": "npm run lint:editorconfig && npm run lint:css && npm run lint:js"
    },
    "lint-staged": {
        "*": [
            "editorconfig-checker"
        ],
        "*.js": [
            "eslint --fix"
        ],
        "*.css": [
            "stylelint --fix"
        ]
    },
    "simple-git-hooks": {
        "pre-commit": "npx lint-staged",
        "pre-push": "npm run lint"
    }
}
```

As you can see, I use editorconfig to check all the files and separate linters for JS and CSS files. So when I commit, `simple-git-hooks` calls the `lint-staged`, and `lint-staged` does all the magic connected to fixing the staged files.

When I try to push my local changes to the remote repo, `simple-git-hooks` starts linters with `npm run lint`, and if the linters fail, the push will be stopped until I fix all the errors.

To apply the config, run the following command.

```bash
npx simple-git-hooks
```

**More:** [Git Hooks: share with your team](/chunks/git-hooks-share/)

## Conclusion

It's easier to have clean code in your repo when you have git hooks configured. Add clear warning messages with helpful tips, links, and instructions to help other people contribute to your project. And don't waste your time fixing the accidents instead of preventing them.

## Resources

- [Git Hooks documentation](https://git-scm.com/docs/githooks)
- [Bitbucket: Git Hooks tutorial](https://www.atlassian.com/git/tutorials/git-hooks)
- [Git Hooks](https://githooks.com/)
- [Tips for using a git pre-commit hook](https://codeinthehole.com/tips/tips-for-using-a-git-pre-commit-hook/)
