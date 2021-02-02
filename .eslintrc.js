module.exports = {
  parser: 'babel-eslint',
  extends: [
    'standard',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard',
  ],
  plugins: ['react', 'react-native', 'import', 'jest'],
  env: {
    'react-native/react-native': true,
    'jest/globals': true,
  },
  rules: {
    'import/no-unresolved': 2,
    'react/jsx-uses-vars': 2,
    'react/jsx-uses-react': 2,
  },
  settings: {
    'import/core-modules': ['react-native-reanimated'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.ios.js', '.andoid.js', '.web.js'],
      },
    },
  },
};
