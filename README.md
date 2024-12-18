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
- [Changes](#changes)
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
  extensions: [syntax()],
  htmlExtensions: [html()],
});

console.log(output);
```

Yields:

```html
<p><a href="/tags/tag" class="micromark-taggable tag">#tag</a></p>
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

## Changes

- `v1.0.0`:
  - Moved the library over to TypeScript.
  - ⚠️ **Breaking Change**: The library now supplies an `Extension` instead of an `Array<Extension>`. There is now no need for using the spread operator when passing the `syntax` extension

Please refer to the [changelog](CHANGELOG.md) for more information regarding changes
