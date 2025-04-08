// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const envName = process.env.NX_TASK_TARGET_CONFIGURATION;
const fileReplacementsPlugin = {
  name: 'fileReplacements',
  setup(build) {
    build.onLoad({ filter: /environment.ts$/ }, async (args) => {
      let fileReplacementPath = args.path;
      if (envName === 'development') {
        fileReplacementPath = fileReplacementPath.replace(
          'environment.ts',
          'environment.development.ts'
        );
      }
      const contents = await fs.promises.readFile(fileReplacementPath, 'utf8');
      return {
        contents,
        loader: 'default',
      };
    });
  },
};
module.exports = {
  sourcemap: false,
  outExtension: {
    '.js': '.js',
  },
  plugins: [fileReplacementsPlugin],
};
