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

`blocks` is an array of blocks' representations. Each element of this array describes a unique pair of tags with start, end,
prefix, suffix and optional replacement. These values are represented by a string or an object with the following properties:
```
start: 'dev-start'             # a string defines a name for the start tag (unique)
end: 'dev-end'                 # a string defines a name for the end tag (unique)
prefix: '/*'                   # a string defines the beginning of a tag
suffix: '*/'                   # a string defines the end of a tag
replacement: 'optional'        # a string defines a substitution for a removed block
```


## Usage example

For example, suppose the task is to strip some debug information and non-production code from this code sample.
```javascript
function makeFoo(bar, baz) {
    console.log('creating Foo'); 
    
    if (bar instanceof Bar !== true) {
        throw new Error('makeFoo: bar param must be an instance of Bar');
    }
    
    if (baz instanceof Baz !== true) {
        throw new Error('makeFoo: baz param must be an instance of Baz');
    }
    
    return new Foo(bar, baz);
}
```

The plugin strips blocks of code marked with two paired tags (a block). A block is represented by a string or an object
with the properties described in "[Options](#options)" above. Let's identify two different blocks and describe them in the configuration:
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
          prefix: '//',
          suffix: '',
        },
      ],
    }),
  ],
})
```

Once the blocks are described in the configuration, the unwanted areas of code can be marked in the code:
```javascript
function makeFoo(bar, baz) {
    /* debug-start */ console.log('creating Foo'); /* debug-end */
    // dev-start
    if (bar instanceof Bar !== true) {
        throw new Error('makeFoo: bar param must be an instance of Bar');
    }
    // dev-end
    // dev-start
    if (baz instanceof Baz !== true) {
        throw new Error('makeFoo: baz param must be an instance of Baz');
    }
    // dev-end
    // This code will remain
    return new Foo(bar, baz);
}
```

After the building process, the marked blocks will be completely removed.
```javascript
function makeFoo(bar, baz) {
    // This code will remain
    return new Foo(bar, baz);
}
```


## License

The MIT License (MIT). Please see the [License file](LICENSE.md) for more information.