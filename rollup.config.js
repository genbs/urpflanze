import nodePolyfills from 'rollup-plugin-node-polyfills';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import { uglify } from 'rollup-plugin-uglify';
import del from 'rollup-plugin-delete';

import { version } from './package.json';

const banner = `/* Urpflanze version ${version} */`;

/**
 * Rollup configuration
 */
export default [
	{
		input: 'src/index.ts',
		output: {
			banner,
			name: 'Urpflanze',
			file: 'build/urpflanze.min.js',
			format: 'umd',
			sourcemap: true,
			compact: true,
		},
		plugins: [
			del({ targets: 'build/*' }),
			nodePolyfills(),
			typescript(),
			uglify(),
		],
	},
	{
		input: 'src/index.ts',
		output: [{
			banner,
			name: 'Urpflanze',
			file: 'build/urpflanze.js',
			format: 'umd',
		}, {
			banner,
			dir: 'dist/cjs',
			format: 'cjs',
			exports: 'auto',
			minifyInternalExports: true,
			preserveModules: true,
			sourcemap: true,
		}, {
			banner,
			dir: 'dist/esm',
			format: 'esm',
			exports: 'auto',
			minifyInternalExports: true,
			preserveModules: true,
			sourcemap: true,
		}],
		plugins: [
			nodePolyfills(),
			typescript(),
			copy({
				targets: [
					{
						src: 'src/index.d.ts',
						dest: 'build/',
					},
					{
						src: 'package.json',
						dest: 'build/',
					},
				],
			}),
		],
	}];
