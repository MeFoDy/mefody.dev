const fs = require('fs');

module.exports = function(config) {
    // config.addPassthroughCopy('src/favicon.ico');
    config.addPassthroughCopy('src/manifest.json');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/styles');
    config.addPassthroughCopy('src/scripts');
    config.addPassthroughCopy('src/**/*.(html|jpg|png|webp|ico|svg|mp4|xml)');

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

    config.addFilter('filterLastArticle', (array) => {
        let lastElement = [];
        lastElement.push(array[array.length - 1]);
        return lastElement;
    });

    config.addFilter('limit', (array, limit) => {
        return array.slice(0, limit);
    });

    config.addFilter('filterTags', (array) => {
        return array.filter(tag => tag !== 'chunk');
    });

    config.addFilter('fixLinks', (content) => {
        const reg = /(src="[^(https://)])|(src="\/)|(href="[^(https://)])|(href="\/)/g;
        const prefix = 'https://tips.mefody.dev' + content.url;
        return content.templateContent.replace(reg, (match) => {
            if (match === 'src="/' || match === 'href="/') {
                match = match.slice(0, -1);
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
