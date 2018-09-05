export default {
  babelrc: false,
  // runtimeHelpers: true,
  presets: ['@babel/env'],
  plugins: [
    // [
    //   '@babel/transform-runtime',
    //   {
    //     corejs: 2
    //   }
    // ],
    '@babel/proposal-object-rest-spread',
    '@babel/proposal-export-default-from',
    '@babel/proposal-export-namespace-from',
    '@babel/proposal-class-properties',
    'add-module-exports'
  ],
  exclude: 'packages/**/node_modules/**'
}
