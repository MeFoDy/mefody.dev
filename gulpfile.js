const gulp = require('gulp');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const del = require('del');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const paths = require('vinyl-paths');

const PUBLIC_PATH = '_public';

// Styles

gulp.task('styles', () => {
    return gulp.src(`${PUBLIC_PATH}/styles/styles.css`)
        .pipe(postcss([
            require('postcss-import'),
            require('postcss-color-hex-alpha'),
            require('autoprefixer')({ grid: 'autoplace' }),
            require('postcss-csso'),
        ]))
        .pipe(gulp.dest(`${PUBLIC_PATH}/styles`));
});

// Scripts

gulp.task('scripts', () => {
    return gulp.src(`${PUBLIC_PATH}/scripts/*.js`)
        .pipe(babel({
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            esmodules: true,
                        },
                    }
                ],
            ]
        }))
        .pipe(terser())
        .pipe(gulp.dest(`${PUBLIC_PATH}/scripts`));
});

// Clean

gulp.task('clean', () => {
    return del([
        `${PUBLIC_PATH}/styles/**/*`,
        `!${PUBLIC_PATH}/styles/styles.css`,
        `${PUBLIC_PATH}/scripts/**/*`,
        `!${PUBLIC_PATH}/scripts/scripts.js`,
    ]);
});

// Cache

gulp.task('cache:hash', () => {
    return gulp.src([
        `${PUBLIC_PATH}/fonts/*.woff2`,
        `${PUBLIC_PATH}/images/**/*.{svg,png,jpg}`,
        `${PUBLIC_PATH}/scripts/*.js`,
        `${PUBLIC_PATH}/styles/*.css`,
        `${PUBLIC_PATH}/manifest.json`,
    ], {
        base: PUBLIC_PATH
    })
        .pipe(paths(del))
        .pipe(rev())
        .pipe(gulp.dest(PUBLIC_PATH))
        .pipe(rev.manifest('rev.json'))
        .pipe(gulp.dest(PUBLIC_PATH));
});

gulp.task('cache:replace', () => {
    return gulp
        .src([
            `${PUBLIC_PATH}/**/*.{html,css}`, `${PUBLIC_PATH}/manifest-*.json`,
        ])
        .pipe(revRewrite({
            manifest: gulp.src(`${PUBLIC_PATH}/rev.json`)
        }))
        .pipe(gulp.dest(PUBLIC_PATH));
});

gulp.task('cache', gulp.series(
    'cache:hash',
    'cache:replace',
));


// Build

gulp.task('build', gulp.series(
    'styles',
    'scripts',
    'clean',
    'cache',
));
