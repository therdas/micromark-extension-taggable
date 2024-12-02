# micromark-extension-taggable

[micromark][] extensions to support custom `#tags` and `@mentions`.

## Contents

- [What is this?](#what-is-this)
- [When to use this](#when-to-use-this)
- [Install](#install)
- [Use](#use)
- [Configuration Options](#configuration-options)
- [Authoring](#authoring)
- [Syntax](#syntax)
- [License](#license)

## What is this?

This package contains extensions that add support for custom mentions and tags into [`micromark`][micromark].
It can be configured to parse tags of the following sort:

```md
#tag @user $page #page/subpage
```

For example, with the default configuration,

```md
Micromark is #awesome right @conner ?
```

is parsed to

```html
<p>
  Micromark is
  <a href="/tags/awesome" class="micromark-taggable tag">#awesome</a> right
  <a href="/users/conner" class="micromark-taggable user"> @conner</a> ?
</p>
```

> **Output**: Micromark is <a href="/tags/awesome" class="micromark-taggable tag">#awesome</a> right <a href="/users/conner" class="micromark-taggable user"> @conner</a> ?

## When to use this

This project is useful when you want to support custom tags in markdown.

You can use these extensions when you are working with [`micromark`][micromark].

When you need a syntax tree, you can combine this package with
[`mdast-util-taggable`](mdast-util-taggable).

All these packages are used [`remark-taggable`](remark-taggable). It is recommended to this package when working with [`remark`](remark).

## Install

In Node.js (version 16+), install with [npm][]:

```sh
npm install micromark-extension-taggable
```

In Deno with [`esm.sh`][esmsh]:

```js
import {
  gfmTaskListItem,
  gfmTaskListItemHtml,
} from "https://esm.sh/micromark-extension-taggable";
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {
    gfmTaskListItem,
    gfmTaskListItemHtml,
  } from "https://esm.sh/micromark-extension-taggable?bundle";
</script>
```

## Use

```js
import { micromark } from "micromark";
import { syntax, html } from "micromark-extension-taggable";

const output = micromark("#tag", {
  extensions: [...syntax()],
  htmlExtensions: [html()],
});

console.log(output);
```

Yields:

```html
<ul>
  <li><input type="checkbox" disabled="" checked="" /> a</li>
  <li><input type="checkbox" disabled="" /> b</li>
</ul>
```

## Configuration Options

The following options can be specified:

### `syntax(options)`

- **`options.classes`**: _`string[]`_ = Array of class names to be given to HTML representation of every type of taggable
- **`options.rules`**: _`rule[]`_ = Describes the rules for the taggables/markers.
  - **`rule.marker`**: _`string`_ = The marker that marks the start of a tag.
  - **`rule.type`** _`string`_ = The type of taggable.
  - **`rule.toUrl`**: _`(string) => string`_ = Function that maps the taggable name/value to a URL.
  - **`rule.classes`**: _`string[]`_ = Array of class names to be given to HTML representation of this type of taggable
- **`options.allowEmail`**: _`boolean`_ = If set to true, the parser will also consider `@` and `.` to be valid characters for the title/value.

The defaults are:

```js
{
    classes: ["micromark-taggable"],
    rules: [
        {
            classes: ["tag"],
            marker: "#",
            toUrl: (argument) => `/tags/${argument}`,
            type: "tag",
        },
        {
            classes: ["mention"],
            marker: "@",
            toUrl: (argument) => `/users/${argument}`,
            type: "mention",
        },
    ]
}
```

###### Returns

- **`syntax()`**: Array of extension for `micromark` that can be passed in `extensions`.
  - Because it is an array, it is recommended to use `spread` syntax when passing to `extensions`:
    ```js
    extensions: [...syntax()];
    ```
- **`html()`**: HtmlExtension for `micromark` that can be passed in `htmlExtensions`

###### Returns

Extension for `micromark` that can be passed in `htmlExtensions` to support GFM
task list items when serializing to HTML
([`HtmlExtension`][micromark-html-extension]).

## Authoring

The following restrictions apply to this markdown extension:

- Spaces cannot be used in the taggable value. We recommend using dashes `-` or underscores `_`:
  ```js
  ❌ This is a #multi word tag.
  ✔️ This is a #multi-word-tag.
  ```
  > **Output**: <br/> > `❌ This is a <a href="/tags/multi">#multi</a> word tag.`<br/> > `✔️ This is a <a href="/tags/#multi-word-tag">#multi-word-tag</a>.`
- By default, the parser only considers the following characters:

  - Characters in the [Unicode General Category L](https://www.unicode.org/reports/tr44/#General_Category_Values).
  - The following characters:
    - `/ | :`
  - If the option `Option.rules.rule.allowEmail` is set to true:

    - `. @`

    In this case, do note that periods will _not_ terminate the taggable.

  Anything outside of these characters will _not_ be included in the taggable. For name, we recommend setting up a key for your users that use either:

  - First Name: Only viable for small sets. Example: `John`.
  - An Alias: Viable for a large set of users. Can be alphanumeric, following above constraints. Example: `USR23B3`
  - Using the user's email ID: Viable for any set of users. Example: `contact@therdas.dev`. The option `Option.rules.rule.allowEmail` needs to be set to `true`. As an example:
    ```js
    {
      rules: [
          ...,
          {
              marker: "@",
              type: "mention",
              toUrl: (val) => `/users/${val.replace("@", "-at-").replace(".", "_")}`,
          }
      ],
      allowEmail: true
    }
    ```

## Syntax

Checks form with the following BNF:

```bnf
<taggable> ::= <marker><value>
<marker> ::= # | @
<value> ::= <text>
```

Where both `<marker>` and `<text>` can be specified via options.

## License

[MIT][license] © [Rahul Das][author]

<!-- Definitions -->

[build-badge]: https://github.com/micromark/micromark-extension-gfm-task-list-item/workflows/main/badge.svg
[build]: https://github.com/micromark/micromark-extension-gfm-task-list-item/actions
[coverage-badge]: https://img.shields.io/codecov/c/github/micromark/micromark-extension-gfm-task-list-item.svg
[coverage]: https://codecov.io/github/micromark/micromark-extension-gfm-task-list-item
[downloads-badge]: https://img.shields.io/npm/dm/micromark-extension-gfm-task-list-item.svg
[downloads]: https://www.npmjs.com/package/micromark-extension-gfm-task-list-item
[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=micromark-extension-gfm-task-list-item
[size]: https://bundlejs.com/?q=micromark-extension-gfm-task-list-item
[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg
[backers-badge]: https://opencollective.com/unified/backers/badge.svg
[collective]: https://opencollective.com/unified
[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg
[chat]: https://github.com/micromark/micromark/discussions
[npm]: https://docs.npmjs.com/cli/install
[esmsh]: https://esm.sh
[license]: license
[author]: https://wooorm.com
[contributing]: https://github.com/micromark/.github/blob/main/contributing.md
[support]: https://github.com/micromark/.github/blob/main/support.md
[coc]: https://github.com/micromark/.github/blob/main/code-of-conduct.md
[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[typescript]: https://www.typescriptlang.org
[development]: https://nodejs.org/api/packages.html#packages_resolving_user_conditions
[micromark]: https://github.com/micromark/micromark
[micromark-html-extension]: https://github.com/micromark/micromark#htmlextension
[micromark-extension]: https://github.com/micromark/micromark#syntaxextension
[micromark-extension-gfm]: https://github.com/micromark/micromark-extension-gfm
[mdast-util-gfm-task-list-item]: https://github.com/syntax-tree/mdast-util-gfm-task-list-item
[mdast-util-gfm]: https://github.com/syntax-tree/mdast-util-gfm
[remark-gfm]: https://github.com/remarkjs/remark-gfm
[task list items]: https://github.github.com/gfm/#task-list-items-extension-
[github-markdown-css]: https://github.com/sindresorhus/github-markdown-css
[html-input-checkbox]: https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)
[api-gfm-task-list-item]: #gfmtasklistitem
[api-gfm-task-list-item-html]: #gfmtasklistitemhtml
