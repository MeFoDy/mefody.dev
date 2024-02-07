require('dotenv').config();

const gulp = require('gulp');
const postcss = require('gulp-postcss');
// const swc = require('gulp-swc');
const del = require('del');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const paths = require('vinyl-paths');
const workboxBuild = require('workbox-build');
const replace = require('gulp-replace');
const execSync = require('child_process').execSync;
const fs = require('fs');

const PUBLIC_PATH = '_public';
const SRC_PATH = 'src';
const tty = process.platform === 'win32' ? 'CON' : '/dev/tty';

// Styles

gulp.task('styles', () => {
    return gulp
        .src(`${PUBLIC_PATH}/styles/{styles,dark}.css`)
        .pipe(
            postcss([
                require('postcss-import'),
                require('postcss-color-hex-alpha'),
                require('autoprefixer')({ grid: 'autoplace' }),
                require('postcss-csso'),
            ]),
        )
        .pipe(gulp.dest(`${PUBLIC_PATH}/styles`));
});

// Scripts

// gulp.task('scripts', () => {
//     return gulp
//         .src(`${PUBLIC_PATH}/scripts/*.js`)
//         .pipe(
//             swc({
//                 minify: true,
//             }),
//         )
//         .pipe(gulp.dest(`${PUBLIC_PATH}/scripts`));
// });

// Clean

gulp.task('clean', () => {
    return del([
        `${PUBLIC_PATH}/styles/**/*`,
        `!${PUBLIC_PATH}/styles/{styles,dark}.css`,
        // `${PUBLIC_PATH}/scripts/**/*`,
        // `!${PUBLIC_PATH}/scripts/scripts.js`,
    ]);
});

// Cache

gulp.task('cache:hash', () => {
    return gulp
        .src(
            [
                `${PUBLIC_PATH}/fonts/*.woff2`,
                `${PUBLIC_PATH}/images/**/*.{svg,png,jpg,avif}`,
                // `${PUBLIC_PATH}/scripts/*.js`,
                `${PUBLIC_PATH}/styles/*.css`,
                `${PUBLIC_PATH}/manifest.webmanifest`,
            ],
            {
                base: PUBLIC_PATH,
            },
        )
        .pipe(paths(del))
        .pipe(rev())
        .pipe(gulp.dest(PUBLIC_PATH))
        .pipe(rev.manifest('rev.json'))
        .pipe(gulp.dest(PUBLIC_PATH));
});

gulp.task('cache:replace', () => {
    return gulp
        .src([
            `${PUBLIC_PATH}/**/*.{html,css}`,
            `${PUBLIC_PATH}/manifest-*.webmanifest`,
        ])
        .pipe(
            revRewrite({
                manifest: fs.readFileSync(`${PUBLIC_PATH}/rev.json`),
            }),
        )
        .pipe(gulp.dest(PUBLIC_PATH));
});

gulp.task('service-worker', () => {
    return workboxBuild.generateSW({
        globDirectory: PUBLIC_PATH,
        globPatterns: ['**/*.{js,css,webmanifest,ico,woff2}', '**/404.html'],
        swDest: `${PUBLIC_PATH}/sw.js`,
        runtimeCaching: [
            {
                urlPattern: /\.(?:png|jpg|avif|svg)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'images',
                    expiration: {
                        maxEntries: 30,
                    },
                },
            },
            {
                urlPattern: /(\.(?:html))|(\/)$/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'articles',
                    expiration: {
                        maxEntries: 20,
                    },
                },
            },
        ],
        mode: 'production',
        skipWaiting: true,
        clientsClaim: true,
        sourcemap: false,
    });
});

gulp.task('cache', gulp.series('cache:hash', 'cache:replace'));

gulp.task('contributors:get', () => {
    // Get new contributors only on local build
    if (process.env.ELEVENTY_ENV === 'production') {
        return new Promise((resolve) => resolve());
    }

    const contributors = execSync('git shortlog -sne < ' + tty).toString();
    const myEmails = [
        'n.a.dubko@gmail.com',
        'mefody@yandex-team.ru',
        'mefody93@gmail.com',
        'MeFoDy@users.noreply.github.com',
    ];
    const contributorsNames = contributors
        .split('\n')
        .filter(Boolean)
        .filter((line) => !myEmails.some((myEmail) => line.includes(myEmail)))
        .map((contributorLine) => {
            const info = contributorLine.split('\t')[1];
            const name = info.split(' <')[0];
            return name;
        });

    return new Promise((resolve) => {
        fs.writeFileSync(
            `${SRC_PATH}/data/contributors.json`,
            JSON.stringify(contributorsNames),
        );

        resolve();
    });
});

gulp.task('humans:generate', () => {
    const contributors = JSON.parse(
        fs.readFileSync(`${SRC_PATH}/data/contributors.json`),
    );
    const date = new Date();

    return gulp
        .src(`${PUBLIC_PATH}/humans.txt`)
        .pipe(replace('{LAST_UPDATE}', date.toISOString()))
        .pipe(replace('{CONTRIBUTORS}', contributors.join('\n\t')))
        .pipe(gulp.dest(PUBLIC_PATH));
});

// Build

gulp.task(
    'build',
    gulp.parallel(
        gulp.series('styles', 'clean', 'cache', 'service-worker'),
        gulp.series('contributors:get', 'humans:generate'),
    ),
);
