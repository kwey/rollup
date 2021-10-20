import path from 'path';
import less from 'less';
import pkg from './package.json';

export const resolve = function (...args) {
	return path.resolve(__dirname, ...args);
};
// 打包任务的个性化配置
export const jobs = {
	esm: {
		output: {
			format: 'esm',
			file: resolve(pkg.module),
		},
	},
	umd: {
		output: {
			sourcemap: true,
			format: 'umd',
			file: resolve(pkg.main),
			name: 'KWE',
		},
	},
	min: {
		output: {
			format: 'umd',
			file: resolve(pkg.main.replace(/(.\w+)$/, '.min$1')),
			name: 'KWE',
		},
	},
};

export const processLess = function (context, payload) {
	return new Promise((resolve, reject) => {
		less.render(
			{
				file: context,
			},
			function (err, result) {
				if (!err) {
					resolve(result);
				} else {
					reject(err);
				}
			},
		);

		less.render(context, {}).then(
			function (output) {
				// output.css = string of css
				// output.map = string of sourcemap
				// output.imports = array of string filenames of the imports referenced
				if (output && output.css) {
					resolve(output.css);
				} else {
					reject({});
				}
			},
			function (err) {
				reject(err);
			},
		);
	});
};
