import {describe, expect, it} from 'vitest';
import converter from '../helpers/converter.js';
import VitePlugin from '../helpers/adapter.js';

describe('README example test suite', () => {
  const input = `function makeFoo(bar, baz) {
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
}`;

  const expected = `function makeFoo(bar, baz) {
    // This code will remain
    return new Foo(bar, baz);
}`;

  it('can process the example from README.md', () => {
    const plugin = VitePlugin({
      blocks: [
        'debug',
        {
          start: 'dev-start',
          end: 'dev-end',
          prefix: '//',
          suffix: '',
        },
      ],
    });

    const output = plugin.transform(input);

    expect(converter(output)).toBe(converter(expected));
  });
});
