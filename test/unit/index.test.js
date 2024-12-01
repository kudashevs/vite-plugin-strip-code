import {describe, expect, it} from 'vitest';
import VitePlugin from '../helpers/adapter.js';

describe('default test suite', () => {
  const originalMode = import.meta.env.MODE;
  const plugin = VitePlugin();

  it.each([
    ['production', '/* dev-start */ any /* dev-end */', ''],
    ['test', '/* dev-start */ any /* dev-end */', ''],
  ])('can proceed in %s environment', (environment, input, expected) => {
    import.meta.env.MODE = environment;

    expect(import.meta.env.MODE).toStrictEqual(environment);
    expect(plugin.transform(input)).toStrictEqual(expected);

    import.meta.env.MODE = originalMode;
  });

  it.each([
    ['development', '/* dev-start */ any /* dev-end */', '/* dev-start */ any /* dev-end */'],
  ])('can skip in %s environment', (environment, input, expected) => {
    import.meta.env.MODE = environment;

    expect(import.meta.env.MODE).toStrictEqual(environment);
    expect(plugin.transform(input)).toStrictEqual(expected);

    import.meta.env.MODE = originalMode;
  });

  it('can skip development environment set with a vite option', () => {
    import.meta.env.MODE = 'development';

    const input = '/* dev-start */ any /* dev-end */';
    const expected = '/* dev-start */ any /* dev-end */';

    expect(plugin.transform(input)).toStrictEqual(expected);

    import.meta.env.MODE = originalMode;
  });

  it('can handle an empty mode option', () => {
    import.meta.env.MODE = '';

    const input = '/* dev-start */ any /* dev-end */';
    const expected = '';

    expect(plugin.transform(input)).toStrictEqual(expected);

    import.meta.env.MODE = originalMode;
  });

  it('can handle an empty blocks options', () => {
    const plugin = VitePlugin({
      blocks: [],
    });

    const input = '/* dev-start */ any /* dev-end */';
    const expected = '';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it.each([
    ['is of a wrong type', {blocks: 'wrong'}, 'blocks option must be an array'],
    ['has a wrong value', {blocks: [42]}, 'blocks.0 should be a string or a valid object'],
  ])('can validate blocks option when it %s', (_, options, expected) => {
    const plugin = VitePlugin(options);
    try {
      const input = '/* dev-start */ any /* dev-end */';

      plugin.transform(input);
    } catch (e) {
      expect(e.message).toStrictEqual(expected);
    }
    expect.assertions(1);
  });

  it('can ignore files from node_modules with default options', () => {
    const path = '/node_modules/axios/index.js';
    const input = 'visible /* dev-start */ will be removed /* dev-end */';
    const expected = 'visible /* dev-start */ will be removed /* dev-end */';

    expect(plugin.transform(input, path)).toStrictEqual(expected);
  });

  it('can process files from node_modules with the specific option', () => {
    const plugin = VitePlugin({
      ignoreNodeModules: false,
    });

    const path = '/node_modules/axios/index.js';
    const input = 'visible /* dev-start */ will be removed /* dev-end */';
    const expected = 'visible ';

    expect(plugin.transform(input, path)).toStrictEqual(expected);
  });

  it('can remove a code block marked with the colon (default block representation)', () => {
    const input = 'visible /* dev-start */ will be removed /* dev-end */';
    const expected = 'visible ';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it('can use special characters in names', () => {
    const plugin = VitePlugin({
      blocks: [
        {
          start: '*dev#start!',
          end: '*dev#end!',
          prefix: '<!--',
          suffix: '-->',
        },
      ],
    });

    const input = 'visible <!-- *dev#start! --> will be removed <!-- *dev#end! -->';
    const expected = 'visible ';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it('can remove a code block marked in lower case', () => {
    const input = 'visible /* dev-start */ will be removed /* dev-end */';
    const expected = 'visible ';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it('cannot remove a code block marked in upper case with default options', () => {
    const input = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";
    const expected = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it('can remove a code block marked in upper case with the specific options', () => {
    const plugin = VitePlugin({
      blocks: [
        {
          start: 'DEVBLOCK-START',
          end: 'DEVBLOCK-END',
          prefix: '/*',
          suffix: '*/',
        },
      ],
    });

    const input = 'visible /* DEVBLOCK-START */ will be removed /* DEVBLOCK-END */';
    const expected = 'visible ';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it('can replace a code block with a replacement', () => {
    const plugin = VitePlugin({
      blocks: [
        {
          start: 'dev-start',
          end: 'dev-end',
          prefix: '<!--',
          suffix: '-->',
          replacement: '<!-- replaced -->',
        },
      ],
    });

    const input = 'visible <!-- dev-start --> will be removed <!-- dev-end -->';
    const expected = 'visible <!-- replaced -->';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });
});
