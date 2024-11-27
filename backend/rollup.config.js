import commonjs from '@rollup/plugin-commonjs';
import run from '@rollup/plugin-run';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { sentryRollupPlugin } from '@sentry/rollup-plugin';
import { readFileSync } from 'fs';
import includePaths from 'rollup-plugin-includepaths';
import watchGlobs from 'rollup-plugin-watch-globs';
import json from '@rollup/plugin-json';

// eslint-disable-next-line no-undef
const dev = process.env.ROLLUP_WATCH === 'true';
const pkg = JSON.parse(readFileSync('./package.json'));

const config = {
  input: './src/index.ts',
  output: {
    sourcemap: true,
    file: 'dist/index.js',
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    watchGlobs(['src/**/*.njk']),
    includePaths({
      include: {},
      paths: ['.'],
      external: [],
      extensions: ['.js', '.ts', '.d.ts', '.cjs', '.json'],
    }),
    typescript(),
    json(),
    commonjs({ extensions: ['.js', '.ts', '.cjs', '.json'] }),
    dev && run(),
    !dev && terser(),
    sentryRollupPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'exa-3r',
      project: 'node-express',
      telemetry: false,
    }),
  ],
};

export default config;
