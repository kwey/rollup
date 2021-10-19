import path from 'path';
import babel from 'rollup-plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import less from 'less';
import svg from 'rollup-plugin-svg';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import git from "git-rev-sync";
import pkg from './package.json';

const extensions = ['.js', '.ts'];

const resolve = function (...args) {
	return path.resolve(__dirname, ...args);
};

// 打包任务的个性化配置
const jobs = {
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

const set = jobs[process.env.FORMAT || 'umd'];
const module = process.env.FORMAT === 'es';
const isPro = !!process.env.FORMAT;

const processLess = function (context, payload) {
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
const meta = {
    name: pkg.name,
    version: pkg.version,
    hash: '',
    branch: '',
    lastModefied: new Date().toISOString(),
}
try {
    meta.hash = git.short()
    meta.branch =git.branch()
} catch (error) {
    
}
// 从环境变量获取打包特征
export default {
	input: resolve('./src/index.ts'),
	...set,
	plugins: [
		nodeResolve({
			extensions,
			modulesOnly: true,
		}),
		replace({
			_METADATA_: JSON.stringify(meta),
		}),
		postcss({
			extract: false, // 是否独立css 文件
			minimize: isPro,
			process: processLess,
			sourceMap: true,
			plugins: [autoprefixer(), cssnano()],
		}),
		svg(),
		babel({
			extensions,
			// exclude: 'node_modules/**',
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {
							browsers: ['ie 11'],
						},
					},
				],
			],
		}),
		terser({
			module,
			mangle: true,
			compress: true,
		}),
	],
};
