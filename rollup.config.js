import typescriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';

export default {
  input: 'src/index.tsx',
  output: {
    file: 'dist/index.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    commonjs({
      namedExports: {
        'node_modules/react-dom/index.js': [
            'render',
        ],
        'node_modules/react/index.js': [
            'Component',
            'PropTypes',
            'Fragment',
            'createElement',
            'useEffect',
            'useState',
        ],
      },
    }),
    nodeGlobals(),
    typescriptPlugin({
      typescript,
    }),
  ],
};
