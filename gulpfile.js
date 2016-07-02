const fs = require('fs')
const gulp = require('gulp')
const glob = require('glob')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const clean = require('gulp-clean')
const header = require('gulp-header')
const ts = require('gulp-typescript')
const rollup = require('gulp-rollup')
const includePaths = require('rollup-plugin-includepaths')
const uglify = require('gulp-uglify')

gulp.task('clean', () =>
  gulp.src('build')
    .pipe(clean())
)

const tsResult =
  gulp.src(['assets/env.d.ts', 'packages/*/src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(ts(ts.createProject('tsconfig.json', {
      typescript: require('typescript'),
      noEmit: false,
    })))

gulp.task('typings', () =>
  tsResult.dts
    .pipe(rename(maybeRenameSourcePath))
    .pipe(gulp.dest('build/typings'))
)

gulp.task('es6', () =>
  tsResult.js
    .pipe(sourcemaps.write())
    .pipe(rename(maybeRenameSourcePath))
    .pipe(gulp.dest('build/es6'))
)

gulp.task('es3', ['es6'], () =>
  gulp.src('build/es6/**/*.js')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(ts({
      allowJs: true,
      target: 'es3',
      module: 'commonjs',
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/es3'))
)

const headerTemplate =
`/*!
 * Vulture v<%= version %>
 * (c) 2016 Caleb Meredith
 * Released under the MIT License.
 */
`

gulp.task('dist', ['es6'], () =>
  gulp.src(['assets/entries/*.js', 'build/es6/**/*.js'])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rollup({
      entry: glob.sync('assets/entries/*.js'),
      format: 'iife',
      moduleName: 'Vulture',
      plugins: [
        includePaths({ paths: ['build/es6'] }),
      ],
    }))
    .pipe(ts({
      allowJs: true,
      target: 'es3',
    }))
    .pipe(header(headerTemplate, {
      version: JSON.parse(fs.readFileSync('lerna.json', 'utf8')).version,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/dist'))
)

gulp.task('dist-min', ['dist'], () =>
  gulp.src('build/dist/+([^.]).js')
    .pipe(sourcemaps.init())
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(sourcemaps.write('.'))
    .pipe(rename(addMinToPath))
    .pipe(gulp.dest('build/dist'))
)

gulp.task('bundle', ['typings', 'es6', 'es3'], () =>
  gulp.src('build/{typings,es6,es3}/*/**/*.*')
    .pipe(rename(moveToPackage))
    .pipe(gulp.dest('packages'))
)

gulp.task('default', ['typings', 'es6', 'es3', 'dist', 'dist-min'])

function maybeRenameSourcePath (path) {
  const sourcePathRe = /(vulture[^/]*)\/src(.*)$/

  if (sourcePathRe.test(path.dirname)) {
    const [, package, dirname] = sourcePathRe.exec(path.dirname)
    path.dirname = `${package}${dirname}`
  }
}

function addMinToPath (path) {
  const jsPathRe = /^(.*?)(\.js)?$/
  const [, basename, extension] = jsPathRe.exec(path.basename)
  path.basename = `${basename}.min${extension || ''}`
}

function moveToPackage (path) {
  const dirnameRe = /^([^/]+)\/([^/]+)(\/.+)?$/
  const [, artifact, package, rest] = dirnameRe.exec(path.dirname)
  path.dirname = `${package}/dist/${artifact}/${rest || ''}`
}
