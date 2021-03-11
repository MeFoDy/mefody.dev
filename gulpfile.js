const gulp = require('gulp');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const del = require('del');
const rev = require('gulp-rev');
const replace = require('gulp-replace');
const revRewrite = require('gulp-rev-rewrite');
const paths = require('vinyl-paths');
const fs = require('fs');

// Styles

gulp.task('styles', () => {
    return gulp.src('public/styles/styles.css')
        .pipe(postcss([
            require('postcss-import'),
            require('postcss-color-hex-alpha'),
            require('postcss-css-variables'),
            require('autoprefixer')({ grid: "autoplace" }),
            require('postcss-csso'),
        ]))
        .pipe(gulp.dest('public/styles'));
});

// Scripts

gulp.task('scripts', () => {
    return gulp.src('public/scripts/*.js')
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
        .pipe(gulp.dest('public/scripts'));
});

// Clean

gulp.task('clean', () => {
    return del([
        'public/styles/**/*',
        '!public/styles/styles.css',
        'public/scripts/**/*',
        '!public/scripts/scripts.js',
    ]);
});

// Cache

gulp.task('cache:hash', () => {
    return gulp.src([
        'public/fonts/*.woff2',
        'public/images/**/*.{svg,png,jpg}',
        'public/scripts/*.js',
        'public/styles/*.css',
        'public/manifest.json'
    ], {
        base: 'public'
    })
        .pipe(paths(del))
        .pipe(rev())
        .pipe(gulp.dest('public'))
        .pipe(rev.manifest('rev.json'))
        .pipe(gulp.dest('public'));
});

gulp.task('cache:replace', () => {
    return gulp
        .src([
            'public/**/*.{html,css}',
            'public/manifest-*.json',
        ])
        .pipe(revRewrite({
            manifest: gulp.src('public/rev.json')
        }))
        .pipe(gulp.dest('public'));
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
