const fs = require('fs-extra')
const path = require('path')

function getGulpFile(ctx) {
  const { outDir } = ctx

  return `
  const gulp = require('gulp')
  const uglify = require('gulp-uglify-es').default
  const minifycss = require('gulp-minify-css')
  const imagemin = require('gulp-imagemin')
  const htmlmin = require('gulp-htmlmin')
  const autoprefixer = require('gulp-autoprefixer')

  function scripts() {
    return gulp
      .src('${outDir}/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest(data => data.base))
  }

  function styles() {
    return gulp
      .src('${outDir}/**/*.css')
      .pipe(autoprefixer())
      .pipe(minifycss())
      .pipe(gulp.dest(data => data.base))
  }

  function images() {
    return gulp
      .src('${outDir}/**/*.(jpg|jpeg|png)')
      .pipe(imagemin())
      .pipe(gulp.dest(data => data.base))
  }

  function htmls() {
    return gulp
      .src('${outDir}/**/*.html')
      .pipe(htmlmin({
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
      }))
      .pipe(gulp.dest(data => data.base))
  }

  const buildTask = gulp.parallel(scripts, styles, images, htmls)

  exports.default = buildTask
  `
}

async function generateGulpFile(ctx) {
  const file = getGulpFile(ctx)
  const gulpFilePath = path.resolve(__dirname, './gulpfile.js')
  if (fs.pathExistsSync(gulpFilePath)) {
    fs.removeSync(gulpFilePath)
  }
  await fs.writeFile(gulpFilePath, file)
  return gulpFilePath
}

function removeGulpFile() {
  const gulpFilePath = path.resolve(__dirname, './gulpfile.js')
  fs.removeSync(gulpFilePath)
}

module.exports = { generateGulpFile, removeGulpFile }
