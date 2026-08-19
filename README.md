Vite Plugin Strip Code ![test workflow](https://github.com/kudashevs/vite-plugin-strip-code/actions/workflows/run-tests.yml/badge.svg)
==========================

The `vite-plugin-strip-code` strips marked blocks from any type of code.

## Install

```bash
# NPM
npm install --save-dev vite-plugin-strip-code
# Yarn
yarn add --dev vite-plugin-strip-code
```


## Options

`ignoreNodeModules` is a boolean that defines whether to process the `node_modules` folder.

`blocks` is an array of blocks' representations. Each element of this array describes a unique pair of tags. Pairs can
be defined as a string or an object with different properties. For more information about `blocks` values and how to use
them, please refer to the [strip-code plugin](https://github.com/kudashevs/strip-code#options).

```
name: 'name'            # string defines a name for a pair of tags - required if defined by a name
separator: '-'          # string defines a separator between a name and a position - optional
start: 'dev-start'      # string defines a name for the start tag (unique) - required if defined by start/end
end: 'dev-end'          # string defines a name for the end tag (unique) - required if defined by start/end
prefix: '/*'            # string defines the beginning of a tag (non-empty string) - optional
suffix: '*/'            # string defines the end of a tag (can be an empty string) - optional
replacement: 'any'      # string defines a substitution for a removed block - optional
```

The plugin supports zero config. When no options are provided, it uses default start, end, prefix and suffix values.


## Usage example

Imagine you want to strip debug information and non-production code from this sample (already marked by special paired comments).
```javascript
function makeFoo(bar, baz) {
    /* debug-start */ console.log('creating Foo'); /* debug-end */
    // development_start
    if (bar instanceof Bar !== true) {
        throw new Error('makeFoo: bar param must be an instance of Bar');
    }
    // development_end
    // devteam2:open
    if (baz instanceof Baz !== true) {
        throw new Error('makeFoo: baz param must be an instance of Baz');
    }
    // devteam2:close
    // This code will remain
    return new Foo(bar, baz);
}
```

The plugin strips blocks of code marked with a pair of tags (a block). A block is defined as a string or an object with
the properties described in "[Options](#options)" above. Let's define different pairs of tags (blocks) in the configuration:
```javascript
// vite.config.js 
import {defineConfig} from 'vite';
import StripCode from 'vite-plugin-strip-code';

export default defineConfig({
  plugins: [
    StripCode({
      blocks: [
        'debug',
        {
          name: 'development',
          separator: '_',
          prefix: '//',
          suffix: '',
        },
        {
          start: 'devteam2:open',
          end: 'devteam2:close',
          prefix: '//',
          suffix: '',
        }
      ],
    }),
  ],
})
```

After the building process, the marked blocks will be completely removed from code.
```javascript
function makeFoo(bar, baz) {
    // This code will remain
    return new Foo(bar, baz);
}
```


## License

The MIT License (MIT). Please see the [License file](LICENSE.md) for more information.
