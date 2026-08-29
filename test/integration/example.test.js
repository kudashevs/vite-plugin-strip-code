import {createServer, version as viteVersion} from 'vite';
import {describe, expect, it} from 'vitest';
import converter from '../helpers/converter.js';
import ViteStripCode from "../../src/index.js";
import path from "node:path";

describe('README example test suite', () => {
  const fixture = path.resolve(
    __dirname,
    '../fixtures/integration.js',
  );

  const expected = `function makeFoo(bar, baz) {
    // This code will remain
    return new Foo(bar, baz);
}\n`;

  it('can skip an acceptance fixture in development', async () => {
    const server = await createServer({
      configFile: false,
      mode: "development",
      plugins: [
        ViteStripCode({
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
        })
      ],
      build: {
        write: false,
        minify: false,
        ...(viteVersion >= 8
            ? {
              rolldownOptions: {
                input: fixture,
                treeshake: false,
              },
            }
            : {
              rollupOptions: {
                input: fixture,
                treeshake: false,
              },
            }
        ),
      }
    });

    const output = (await server.transformRequest(fixture))?.code;

    expect(converter(output)).toContain('console.log');
  });

  it('can process an acceptance fixture', async () => {
    const server = await createServer({
      configFile: false,
      mode: 'production',
      plugins: [
        ViteStripCode({
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
        })
      ],
      build: {
        write: false,
        minify: false,
        ...(viteVersion >= 8
            ? {
              rolldownOptions: {
                input: fixture,
                treeshake: false,
              },
            }
            : {
              rollupOptions: {
                input: fixture,
                treeshake: false,
              },
            }
        ),
      }
    });

    const output = (await server.transformRequest(fixture))?.code;

    expect(converter(output)).toBe(converter(expected));
  });
});
