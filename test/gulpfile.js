/** gulpfile.js
* @author Adrián Ramos Mejías - Grado en Ingeniería Informática ULL
*/
var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('default', function () {
  console.log('gulp!');
});

gulp.task("pre-install", shell.task([
  "npm i -g gulp static-server",
  "npm install -g nodemon",
  "npm install -g gulp-shell"
]));

gulp.task("doc", shell.task("jsdoc test -r"));
gulp.task("test", shell.task("npm test"));
