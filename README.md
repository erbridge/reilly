# Reilly

Check conversational English for insensitive language.

Inspired by [Alex](https://alexjs.com/), but with more opinions and less noise.

## Installation

```sh
npm install reilly
```

## Usage

```js
const reilly = require("reilly");

const text = "The **boogeyman** is coming.";
const settings = {
  presets: ["ableism"],
  enable: ["boogeyman-boogeywoman"],
  ignore: ["boogeyman"],
};

reilly(text, settings);
```

The default export is a function that take `text: string` as its first argument
and [`settings?: ReillySettings`](#ReillySettings) as an optional second
argument. It returns a promise to a [`VFile`](https://github.com/vfile/vfile)
with messages set to include any issues found.

### `ReillySettings`

Reilly understands the following properties in its `settings` argument:

- `presets?: string[]`

  For example:

  ```js
  reilly(text, { presets: ["ableism"] });
  ```

  Reilly comes with a number of [presets](src/presets/) ready to use. Provide an
  array of their names.

  Presets are only ever additive, meaning they will never disable or override
  each other.

  Other properties of `settings` override the presets where relevant.

- `enable?: string[]`

  For example:

  ```js
  reilly(text, { enable: ["boogeyman-boogeywoman"] });
  ```

  A list of rules to enable.

  If `presets` and `enable` are both undefined, all rules are enabled.

  Currently supported rules:

  - [`retext-equality`](https://github.com/retextjs/retext-equality/blob/master/rules.md)

- `ignore?: string[]`

  For example:

  ```js
  reilly(text, { ignore: ["boogeyman"] });
  ```

  A list of "not ok" phrases to ignore, even when they would normally be caught
  by an enabled rule.

## Related

### Built with Reilly

- [Reilly Slack Bot](https://github.com/erbridge/reilly-slack-bot) - A Slack bot
  to check conversational English for insensitive language

### Similar / Connected

- [Alex](https://alexjs.com/) - Catch insensitive, inconsiderate writing
- [`retext-equality`](https://github.com/retextjs/retext-equality) - Check for
  possible insensitive, inconsiderate language
- [`retext-passive`](https://github.com/retextjs/retext-passive) - Check passive
  voice
- [`retext-profanities`](https://github.com/retextjs/retext-profanities) - Check
  for profane and vulgar wording
- [`retext-simplify`](https://github.com/retextjs/retext-simplify) - Check
  phrases for simpler alternatives
