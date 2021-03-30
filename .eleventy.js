const fs = require('fs');

module.exports = function(config) {
    config.addPassthroughCopy({'src/images/favicon/favicon.ico': 'favicon.ico'});
    config.addPassthroughCopy('src/manifest.webmanifest');
    config.addPassthroughCopy('src/fonts/*.woff2');
    config.addPassthroughCopy('src/styles');
    config.addPassthroughCopy('src/scripts');
    config.addPassthroughCopy('src/**/*.(html|jpg|png|webp|avif|ico|svg|mp4|xml)');

    // Collections

    config.addCollection('tagList', (collection) => {
        const set = new Set();
        for (const item of collection.getAllSorted()) {
            if ('tags' in item.data) {
                let tags = item.data.tags;
                if (typeof tags === 'string') {
                    tags = [tags];
                }
                for (const tag of tags) {
                    set.add(tag);
                }
            }
        }
        return [...set].sort();
    });

    config.addCollection('withTags', function(collectionApi) {
        return collectionApi.getAll().filter(function(item) {
            return 'tags' in item.data;
        });
    });

    // Filters

    config.addFilter('readableDate', (d) => {
        const year = d.getFullYear();
        const date = d.getDate();

        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const monthIndex = d.getMonth();
        const monthName = months[monthIndex];

        return `${monthName} ${date}, ${year}`;
    });

    function sortByDate(array, dateField = 'date') {
        return [...array].sort((a, b) => a[dateField].getTime() - b[dateField].getTime());
    }

    config.addFilter('getLastArticle', (array) => {
        const articles = sortByDate(array).reverse();

        return articles[articles.length - 1];
    });

    config.addFilter('sortByDate', (array) => {
        return sortByDate(array);
    });

    config.addFilter('getRSSArticles', (array) => {
        const articles = sortByDate(array).reverse();

        return articles.slice(0, 20);
    });

    config.addFilter('limit', (array, limit) => {
        return array.slice(0, limit);
    });

    config.addFilter('filterTags', (array) => {
        return array.filter(tag => tag !== 'chunk');
    });

    config.addFilter('prepareTalks', (data) => {
        const talks = data.talks;

        talks.forEach(talk => {
            let lastDate = new Date('1970-01-01');

            talk.versions.forEach(version => {
                version.dateObj = new Date(version.date);

                if (version.dateObj.getTime() > lastDate.getTime()) {
                    lastDate = version.dateObj;
                }

                version.slidesLink = version.slides.startsWith('https:')
                    ? version.slides
                    : data.pathPrefix + version.slides;

            });

            talk.date = lastDate;
        });

        return sortByDate(talks);
    });

    config.addFilter('preparePodcasts', (data) => {
        const podcasts = data.podcasts;

        podcasts.forEach(podcast => {
            podcast.dateObj = new Date(podcast.date);
        });

        return sortByDate(podcasts, 'dateObj');
    });

    config.addFilter('prepareRSS', (content) => {
        const reg = /(src="\.\/)|(src="[^(https://)])|(src="\/)|(href="\.\/)|(href="[^(https://)])|(href="\/)/g;
        const prefix = 'https://mefody.dev' + content.url;
        return content.templateContent.replace(reg, (match) => {
            if (match === 'src="/' || match === 'href="/') {
                match = match.slice(0, -1);
                return match + prefix;
            }
            if (match === 'src="./' || match === 'href="./') {
                match = match.slice(0, -2);
                return match + prefix;
            }
            return match.slice(0, -1) + prefix + match.slice(-1);
        });
    });

    config.addFilter('filterCollection', (array, tag) => {
        if (!tag) {return array;}

        return array.filter(item => 'tags' in item.data && item.data.tags.includes(tag));
    });

    // Transforms

    config.addTransform('htmlmin', require('./_11ty/transforms/htmlmin'));

    config.addTransform('xmlmin', require('./_11ty/transforms/xmlmin'));


    // BrowserSync config

    config.setBrowserSyncConfig({
        callbacks: {
            ready: function(err, bs) {
                bs.addMiddleware('*', (req, res) => {
                    const content_404 = fs.readFileSync('_public/404.html');
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
                    res.write(content_404);
                    res.end();
                });
            }
        }
    });

    // Markdown config

    let markdownIt = require('markdown-it');
    let options = {
        html: true,
        typographer: true,
    };
    config.setLibrary('md', markdownIt(options).disable('code'));

    // Plugins

    config.addPlugin(require('eleventy-plugin-reading-time'));

    config.addPlugin(require('@11ty/eleventy-plugin-syntaxhighlight'), {
        templateFormats: ['njk', 'md'],
        trim: true,
    });

    config.addPlugin(require('@hirusi/eleventy-plugin-safe-external-links'));

    config.addPlugin(require('./_11ty/plugins/img-prepare.js'));

    return {
        dir: {
            input: 'src',
            output: '_public',
            includes: 'includes',
            layouts: 'layouts',
            data: 'data',
        },
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        passthroughFileCopy: true,
        templateFormats: [
            'md', 'njk'
        ],
    };
};
