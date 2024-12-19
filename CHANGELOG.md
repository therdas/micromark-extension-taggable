# Changelog

## 1.0.1
### Changes
- Made some changes to reduce the size of the npm bundle

### Bug Fixes 
- Fixed an issue that can generate due to a token not being consumed.
- Deprecated version 1.0.0 as the above patch should be considered **important**.

## 1.0.0

### Changes

- Moved the library over to TypeScript.
- ⚠️ **Breaking Change**: The library now supplies an `Extension` instead of an `Array<Extension>`. There is now no need for using the spread operator when passing the `syntax` extension

### Bug Fixes

- Strings with a space after the `<marker>` will no longer be parsed incorrectly as an empty taggable.

## 0.1.4

### Changes

- None

### Bug Fixes

- Conflicts between `.gitignore` and `.npmignore` clashing causing `/dist/` to not be synced
- Fixed missing `package.json` fields
- Added and updated dependencies

## 0.1.3

### Changes

- None

### Bug Fixes

- [Not Fixed] Conflicts between `.gitignore` and `.npmignore` clashing causing `/dist/` to not be synced
- Fixed missing `package.json` fields
- Added and updated dependencies

## 0.1.2

### Changes

- Added a `.npmignore` file

### Bug Fixes

- None

## 0.1.1

### Changes

- None

### Bug Fixes

- Fixed issues in `package.json` leading to some files being incorrectly omitted from the NPM package.

## 0.1.0

### Changes

- This is now available on NPM!

### Bug Fixes

- None

## 0.0.1

### Changes

First release 🎉
