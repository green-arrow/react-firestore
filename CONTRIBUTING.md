# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this _free_
series [How to Contribute to an Open Source Project on GitHub][egghead]

## Project setup

1. Fork and clone the repo
2. `npm run setup` to setup and validate your clone of the project
3. Create a branch for your PR

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/green-arrow/react-firestore.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `master`
> branch to use the upstream master branch whenever you run `git pull`. Then you
> can make all of your pull request branches based on this `master` branch.
> Whenever you want to update your version of `master`, do a regular `git pull`.

## Committing and Pushing changes

Please make sure to run the tests before you commit your changes.
You can run all tests and view code coverage by running `npm run test:cover`.

When writing a commit message, you can run `npm run cm` instead of the normal
usual `git commit` to use [commitizen][commitizen] to format your message.
This will take you through a series of prompts so that your commit message is
formatted in such a way that [semantic-release][semantic-release] knows whether
or not to create a new release and how to generate the next version number.

If you're a new contributor or just not comfortable with the command line,
don't worry about specially formatted commit messages. We can work through
that when it's time to get your PR merged!

### opt into git hooks

There are git hooks set up with this project that are automatically installed
when you install dependencies. They're really handy, but are turned off by
default (so as to not hinder new contributors). You can opt into these by
creating a file called `.opt-in` at the root of the project and putting this
inside:

```
pre-commit
```

## Help needed

Please checkout the [the open issues][issues]

Also, please watch the repo and respond to questions/bug reports/feature
requests! Thanks!

[egghead]: https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[commitizen]: https://github.com/commitizen/cz-cli
[semantic-release]: https://github.com/semantic-release/semantic-release
[issues]: https://github.com/green-arrow/react-firestore/issues
