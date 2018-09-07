module.exports = {
  presets: ['@babel/env'],
  plugins: [
    ['@babel/transform-runtime'],
    '@babel/proposal-object-rest-spread',
    '@babel/proposal-export-default-from',
    '@babel/proposal-export-namespace-from',
    '@babel/proposal-class-properties',
    'add-module-exports'
  ]
}
