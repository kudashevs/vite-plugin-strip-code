import VitePluginStripCode from "../../src/plugin.js";
import * as path from "node:path";
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '../any.css');

export default function VitePluginAdapter(options = {}) {
  const adaptee = VitePluginStripCode(options);

  return {
    name: adaptee.name,
    transform(content, id = filePath) {
      const result = adaptee.transform(content, id);

      // the result.code is undefined when transformation is skipped
      return result?.code ?? content;
    },
  };
}
