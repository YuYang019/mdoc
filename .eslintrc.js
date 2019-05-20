module.exports = {
  root: true,
  extends: [
    'plugin:vue-libs/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    indent: ['error', 2, { MemberExpression: 'off' }],
    'no-undef': ['error'],
    'operator-linebreak': ['error', 'before']
  }
}