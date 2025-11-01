import fs from 'node:fs/promises';
import path from 'node:path';

import { diffStringsUnified } from 'jest-diff';

const rulesDir = path.join(import.meta.dirname, '../lib/rules');

async function generateExports() {
  const files = await fs
    .readdir(rulesDir, {
      recursive: false,
      withFileTypes: true,
    })
    .then((entities) => entities.filter((ent) => ent.isFile()));

  const exports = files
    .filter(
      (file) =>
        file.name.endsWith('.ts') &&
        file.name !== 'index.ts' &&
        !file.name.endsWith('.test.ts'),
    )
    .map((file) => {
      const { name } = path.parse(file.name);
      return `export { default as '${name}' } from './${name}.js';`;
    })
    .join('\n');

  return exports;
}

await main();
async function main() {
  const exports = await generateExports();

  const content = `// GENERATED FILE - DO NOT EDIT
${exports}
`;

  const indexPath = path.join(rulesDir, './index.ts');
  const data = await fs.readFile(indexPath);

  if (content === data.toString()) {
    return;
  }

  await fs.writeFile(indexPath, content);

  const diff = diffStringsUnified(content, data.toString());

  const msg = `
Index file had to be updated. Don't forget to commit the changes and restart the build.
--------------
${diff}
--------------
`;
  throw Error(msg);
}
