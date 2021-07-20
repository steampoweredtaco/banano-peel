import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { babel } from '@rollup/plugin-babel';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [{
	input: 'src/internal.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/injection.js',

	},
	plugins: [
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			preferBuiltins: false
		}),
		commonjs(),
		nodePolyfills(
			{
				crypto: true,
				buffer: true
		}),
	

	],
	watch: {
		clearScreen: false
	}
},
{
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',

	},
	plugins: [  svelte({
		compilerOptions: {
			// enable run-time checks when not in production
			dev: !production
		}
	}),

	// If you have external dependencies installed from
	// npm, you'll most likely need these plugins. In
	// some cases you'll need additional configuration -
	// consult the documentation for details:
	// https://github.com/rollup/plugins/tree/master/packages/commonjs
	resolve({
		browser: true,
		preferBuiltins: false,
		dedupe: ['svelte']
	}),
	commonjs(),
	nodePolyfills(
	  {
		  crypto: true,
		  buffer: true
  }),
  babel({ babelHelpers: 'bundled' }),
	// In dev mode, call `npm run start` once
	// the bundle has been generated
	!production && serve(),

	// Watch the `public` directory and refresh the
	// browser on changes when not in production
	!production && livereload('public'),

	// If we're building for production (npm run build
	// instead of npm run dev), minify
	production && terser()
	],
	watch: {
		clearScreen: false
	}
},
{
  input: 'src/background.js',
  output: {
	  sourcemap: true,
	  format: 'iife',
	  name: 'app2',
	  file: 'public/build/bundle2.js'
  },
  plugins: [
  svelte({
		  compilerOptions: {
			  // enable run-time checks when not in production
			  dev: !production
		  }
	  }),

	  // If you have external dependencies installed from
	  // npm, you'll most likely need these plugins. In
	  // some cases you'll need additional configuration -
	  // consult the documentation for details:
	  // https://github.com/rollup/plugins/tree/master/packages/commonjs
	  resolve({
		  browser: true,
		  preferBuiltins: false,
		  dedupe: ['svelte']
	  }),
	  commonjs(),
	  nodePolyfills(
		{
			crypto: true,
			buffer: true
		}),
	  babel({ babelHelpers: 'bundled' }),
	  // In dev mode, call `npm run start` once
	  // the bundle has been generated
	  !production && serve(),

	  // Watch the `public` directory and refresh the
	  // browser on changes when not in production
	  !production && livereload('public'),

	  // If we're building for production (npm run build
	  // instead of npm run dev), minify
	  production && terser()
  ],
  watch: {
	  clearScreen: false
  }
},
];
