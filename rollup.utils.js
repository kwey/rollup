import path from 'path';
import less from 'less';
import git from 'git-rev-sync';
import pkg from './package.json';

export const resolve = function (...args) {
	return path.resolve(__dirname, ...args);
};

export const meta = {
	name: pkg.name,
	version: pkg.version,
	hash: '',
	branch: '',
	lastModefied: new Date().toISOString(),
};
try {
	meta.hash = git.short();
	meta.branch = git.branch();
} catch (error) {}

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
