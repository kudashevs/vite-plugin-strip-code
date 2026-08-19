import {describe, expect, it} from 'vitest';
import converter from '../helpers/converter.js';
import VitePlugin from '../helpers/adapter.js';

describe('README example test suite', () => {
  const input = `function makeFoo(bar, baz) {
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
    });

    const output = plugin.transform(input);

    expect(converter(output)).toBe(converter(expected));
  });
});
