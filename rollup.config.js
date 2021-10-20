import babel from 'rollup-plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import svg from 'rollup-plugin-svg';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import git from 'git-rev-sync';
import pkg from './package.json';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import { jobs, processLess, resolve } from './rollup.utils';

const extensions = ['.js', '.ts'];
const env = process.env.env;
const set = jobs[env] || jobs['umd'];
const module = env === 'es';
const isPro = env && env !== 'un';
const isDev = !env;

const meta = {
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

const plugins = [
	nodeResolve({
		extensions,
		modulesOnly: true,
	}),
	replace({
		preventAssignment: true,
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
];

if (isPro) {
	plugins.push(
		terser({
			module,
			mangle: true,
			compress: true,
		}),
	);
} else if (isDev) {
	plugins.push(livereload());
	plugins.push(
		serve({
			open: true,
			port: 8072,
			contentBase: '',
			openPage: '/demo/index.html',
			headers: {
				'Access-Control-Allow-Origin': '*',
				foo: 'bar',
			},
		}),
	);
}
// 从环境变量获取打包特征
export default {
	input: resolve('./src/index.ts'),
	...set,
	plugins,
};
