# upgrade-dependencies-simple
A simple, auditable, no external dependencies cli script that upgrades your dependencies to the latest version

## Why?
There are multiple packages claiming to do this. All of them have either many dependencies, lengthy code, or it's hard to audit what they are doing.
This project is different. What we do:
 - read the `project.json` from the current working dir
 - fetch the latest `dependencies` and `devDependencies` versions from NPM via a simple rest call
 - by default no destructive actions are done, the new json simply printed to stdout
 - there is a hidden `--force-save` to write out the new `package.json` if you are lazy

## How to use

Prints the upgraded `package.json` to stdout. No destructive actions done
```bash
npx upgrade-dependencies-simple
```

Overwrites your `package.json`.
```bash
npx upgrade-dependencies-simple --force-save
```

PS: Don't forget to run `npm install` after updating your `package.json`!
