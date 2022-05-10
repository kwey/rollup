import svg from 'rollup-plugin-svg';
import filesize from 'rollup-plugin-filesize';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import livereload from 'rollup-plugin-livereload';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

import eslint from '@rollup/plugin-eslint';
import replace from '@rollup/plugin-replace';

import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
/**识别node_modules包 */
import { nodeResolve } from '@rollup/plugin-node-resolve';

import { meta, processLess, resolve } from './rollup.utils';
import pkg from './package.json';
const extensions = ['.js', '.ts'];

const isPro = process.env.env === 'production';

const plugins = [
	nodeResolve({ extensions }),
	commonjs(),
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
	eslint({
		throwOnError: true,
		include: ['*.ts'],
	}),
	svg(),
	typescript(),
];

let proPlugins = [];
if (isPro) {
	proPlugins = [filesize(), terser()];
} else {
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
export default {
	input: './src/index.ts',
	plugins: plugins.concat(proPlugins),
	output: [
		{
			sourcemap: true,
			format: 'umd',
			file: resolve(pkg.main),
			banner: `/*! my-library version ${meta.hash} */`,
			name: 'KWE',
		},
	],
};
