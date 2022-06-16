import less from '@umijs/bundler-utils/compiled/less';

const lessTransformer = function (content: any) {
  return new Promise((resolve, reject) => {
    less
      .render(content, {
        plugins: [
          // new LessPluginAliases({
          //   alias: alias || {},
          // }),
        ]
      })
      .then((result) => {
        resolve(result.css);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default lessTransformer;
