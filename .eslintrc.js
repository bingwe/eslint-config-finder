/**
 * 当前项目只需使用基本配置
 */
module.exports = {
  extends: ['./base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 2,
  },
}
