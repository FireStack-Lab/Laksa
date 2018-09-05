export default {
  babelrc: false,
  // runtimeHelpers: true,
  presets: ['@babel/preset-env'],
  plugins: [
    // '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    'add-module-exports'
  ],
  exclude: 'packages/**/node_modules/**'
}
