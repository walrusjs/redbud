export default (files: Record<string, string>) => {
  expect(files['@vercel/ncc/index.js']).not.toBeUndefined();
  expect(files['@vercel/ncc/index.d.ts']).toBeUndefined();
};
