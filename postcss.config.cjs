const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

const ensureDeclarationSourceFile = {
  postcssPlugin: "ensure-declaration-source-file",
  Once(root) {
    const rootInput = root.source?.input;
    if (!rootInput?.file) return;

    root.walkDecls((decl) => {
      if (!decl.source) {
        decl.source = {
          ...root.source,
          input: rootInput,
        };
        return;
      }

      if (!decl.source.input?.file) {
        decl.source = {
          ...decl.source,
          input: rootInput,
        };
      }
    });
  },
};

module.exports = {
  plugins: [tailwindcss(), autoprefixer(), ensureDeclarationSourceFile],
};
