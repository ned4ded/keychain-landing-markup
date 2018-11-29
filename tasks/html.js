import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import i18next from 'i18next';
import config from '../gulpfile.config';
import engine from 'gulp-nunjucks-render';
import minify from 'gulp-htmlmin';
import Backend from 'i18next-sync-fs-backend';
import rename from 'gulp-rename';

i18next.use(Backend).init({
  // debug: true,
  fallbackLng: ['en'],
  initImmediate: false,
  backend: {
    loadPath: config.paths.locales + '/{{lng}}/{{ns}}.json'
  },
  ns: ['translation'],
  defaultNS: 'translation'
});

export function html(done) {
  const envHooks = [
    env => env.addFilter('typeOf', function(el) {
      const type = typeof el;

      const getType = (t) => {
        if (t == 'object') {

          return el instanceof Array ? 'array' : 'object';
        }

        return t;
      }

      return getType(type);
    }),
    env => env.addFilter('capitalizeFirst', function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }),
    env => env.addFilter('__', function(key, ns) {
      return i18next.t(key);
    }),
  ]

  const data = fs.readdirSync( config.paths.datasets ).reduce( (acc, filename) => {
    return { ...acc, [ path.basename( filename, '.json') ] : require('../' + config.paths.datasets + '/' + filename) };
  }, {});

  data.get = function(name) {
    return this[name];
  }

  const [ def ] = i18next.options.fallbackLng;

  const rec = (arr) => {

    const [lng, ...rest] = arr;

    return i18next.changeLanguage(lng, (err) => {
      if(err) throw new Error(err);

      return gulp.src(config.paths.pages)
        .pipe(engine({
          data: {
            datasets: data,
          },
          path: ['src/pages/templates'],
          manageEnv: function(env) {
            return envHooks.forEach(fn => fn(env));
          },
        }))
        .pipe(minify({ collapseWhitespace: true }))
        .pipe(rename(function(path) {

          path.basename = lng === def ? path.basename : lng + '.' + path.basename;
        }))
        .pipe(gulp.dest(config.server.dest))
        .on('end', () => {
          return rest.length ? rec(rest) : done();
        });
    });
  }

  rec(i18next.options.fallbackLng);

  return;
};
