# Contributing Guidelines

First of all, thank you very much for deciding to contribute in code to 
Swagger-ui-plugin-contracts!

We describe below how you can create a pull request and have it merged in.

## Discuss First

Before you start writing code, please create [a new issue] first and discuss
what you intend to implement.
It can well be that somebody else is already working on it, or that
your code needs to be changed in order to be consistent with the rest of the code base *etc*.

[a new issue]: https://github.com/mristin/swagger-ui-plugin-contracts/issues/new

## Fork

We develop using [GitHub's forks]:

* Create a fork of the repository to your Github account,
* Clone the forked repository locally,
* Write code in a branch of your local repository,
* Push the branch to the remote forked repository, and finally
* Create the pull request (by using Github UI on your forked repository).

Please see the page on [GitHub's forks] for more detailed instruction.

See this page on [how to update your fork to the upstream repository].

[GitHub's forks]: https://guides.github.com/activities/forking/
[how to update your fork to the upstream repository]: https://medium.com/@topspinj/how-to-git-rebase-into-a-forked-repo-c9f05e821c8a

# Development Environment
To set up the development environment on your computer, change to the local
repository and:

[`npm`]: https://www.npmjs.com/

* Make sure you have [`npm`] installed on your machine.

* Install the development dependencies:
    
  ```
  npm install
  ```

Write the Code
==============

Now you can implement your feature.

To build the code:

```
npm run build
```

To prepare the built module for a manual test in your browser:

```
npm run prepare_manual_test
```

The files for the manual test reside in `manual_test/` directory.

To serve the files used for manual testing:

```
npm run serve_manual_test
```

The files from the directory `manual_test/` will be served on `http://localhost:5000`.

Pre-commit Checks
=================
We lint and format the code automatically.

To lint and format:

```
npm run fix
```

To run all the pre-commit checks:

```
npm run check
```

## Commit your Changes

Make a single commit of your changes.

Write the subject of the commit message in [imperative mood].
The subject should not exceed 50 characters.

[imperative mood]: https://en.wikipedia.org/wiki/Imperative_mood

The body of the commit message explains *what* and *why* of your patch (and avoids the *how*).
Please observe the maximum line length of 72 characters for the body.

Here is an example of a commit message:

```
Display language

This patch makes the language of the conditions and snapshots to be
displayed in the top-right corner of the code block.
```

## Review

We will review your pull request as soon as possible.
If changes are requested, please create new commits to address the review
comments.

Once the pull request is approved, we will finally squash
the individual commits and merge it into the main branch.
