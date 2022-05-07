## tsc-alias-2

Alias tsc's (typescript's) output, including file extensions and node_modules aliasing! You can run your code directly in node or the browser with NO BUNDLING! Each output file maps exactly to one source file.

[Example here](example)

### How

```sh
npm i -g tsc-alias-2 # or
npm i --save-dev tsc-alias-2
```

You probably want `outDir` and `rootDir` in your `tsconfig.json`:

```json
{
    "compilerOptions": {
        "outDir": "./dist/",
        "rootDir": "./src/"
    }
}
```

Then just run `tsc && tsc-alias-2` instead of your build step. It will map paths specified in the tsconfig as well.

### Demo

https://user-images.githubusercontent.com/10591373/167230591-19d79a82-1ac8-4af4-9027-b5c0885f20c6.mp4

### Using the result

For the browser, put this in your `index.html`:

```html
<script type="module">
    import { whatever } from './dist/index.mjs'
    alert(whatever())
</script>
```

For node, it's just a

```sh
node ./dist/index.mjs
```

### Why

Chrome performance profiling doesn't work very well with a bundle + sourcemap. It works much better with separate source files. I needed detailed perf on some code, so I made this.

-   `tsc-alias` doesn't point to `node_modules` paths so you can't run in the browser at all! Node doesn't work either because the extensions were wrong. So `tsc-alias-2` also renames `*.js` to `*.mjs` so node expects it to be a module.
-   `digital-loukoum/tsc-esm` seemed to have some bugs. This is largely based on it.

### Library

You can also use import it if you have a js build script or something:

```js
const tscAlias2 = require('tsc-alias-2')
// Checks the tsconfig and does subs:
tscAlias2.main()
// Pass in args directly instead:
tscAlias2.replaceAllImports('./dist/', [{ pattern: '@/*', replacement: './' }])
```
