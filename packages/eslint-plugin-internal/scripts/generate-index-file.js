import fs from 'node:fs/promises';
import path from 'node:path';

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
        file.name.endsWith('.js') &&
        file.name !== 'index.js' &&
        !file.name.endsWith('.test.js'),
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

  const indexPath = path.join(rulesDir, './index.js');
  const data = await fs.readFile(indexPath);

  if (content === data.toString()) {
    return;
  }

  await fs.writeFile(indexPath, content);

  throw Error("Index file was updated. Don't forget to commit the changes.");
}
