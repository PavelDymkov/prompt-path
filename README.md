# prompt-path

![build: passing](https://raw.githubusercontent.com//master/badges/build.svg)
![test: 1.0.0](https://raw.githubusercontent.com//master/badges/test.svg)

When you need to prompt a path in your CLI app.

## Usage

```js
const { promptPath } = require("prompt-path");

promptPath().then((path) => {
    console.log(path);
});
```

## Params (optional)

```js
const path = await promptPath({
    basePath: "~",
    prefix: "file: ",
    target: PromptPathTarget.File,
});
```

-   **basePath** Initial path (current directory by default).
-   **prefix** The prompt string to use (`'> '` by default).
-   **target** File or directory (both by default).
