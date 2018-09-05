{  "presets": [
    [
      "env",
      {
        "overrides": [
          {
            "exclude": "**/**/node_modules/**"
          }
        ],
        "babelrcRoots": [
          // Keep the root as a root
          ".",

          // Also consider monorepo packages "root" and load their .babelrc files.
          "./packages/*"
        ]
      }
    ]
  ],
  plugins: [
    [
      "transform-runtime",
      {
        polyfill: true,
        regenerator: true
      }
    ],
    [
      "transform-class-properties",
      {
        spec: true
      }
    ],
    "add-module-exports"
  ]
}
