module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        alias: {
          '@AllEcompassing': './src',
        },
      },
      'react-native-reanimated/plugin',
    ],
    require.resolve('react-native-reanimated/plugin'),
    'jest-hoist',
  ],
};
