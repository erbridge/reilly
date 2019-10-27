# Robin

Check conversational English for insensitive language.

Inspired by [Alex](https://alexjs.com/), but with more opinions and less noise.

## Installation

```sh
npm install robin
```

## Usage

```js
const robin = require("robin");

const text = "The **boogeyman** is coming.";
const settings = {
  presets: ["ablism"],
  enable: ["boogeyman-boogeywoman"],
  ignore: ["boogeyman"]
};

robin(text, settings);
```

### Settings

Robin understands the following properties in its `settings` argument:

- `presets?: string[]`

  For example:

  ```js
  robin(text, { presets: ["ablism"] });
  ```

  Robin comes with a number of [presets](src/presets/) ready to use. Provide an
  array of their names.

  Presets are only ever additive, meaning they will never disable or override
  each other.

  Other properties of `settings` override the presets where relevant.

- `enable?: string[]`

  For example:

  ```js
  robin(text, { enable: ["boogeyman-boogeywoman"] });
  ```

  A list of rules to enable.

  If `presets` and `enable` are both undefined, all rules are enabled.

  Currently supported rules:

  - [`retext-equality`](https://github.com/retextjs/retext-equality/blob/master/rules.md).

- `ignore?: string[]`

  For example:

  ```js
  robin(text, { ignore: ["boogeyman"] });
  ```

  A list of phrases to ignore, even when they would normally be caught by an
  enabled rule.

  Currently supported rules:

  - [`retext-equality`](https://github.com/retextjs/retext-equality/blob/master/rules.md).
