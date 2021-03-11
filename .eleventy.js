module.exports = function(config) {
    // config.addPassthroughCopy('src/favicon.ico');
    config.addPassthroughCopy('src/manifest.json');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/styles');
    config.addPassthroughCopy('src/scripts');
    config.addPassthroughCopy('src/**/*.(html|gif|jpg|png|ico|svg|mp4|webm|zip|xml)');

    config.addCollection('tagList', (collection) => {
        const set = new Set();
        for (const item of collection.getAllSorted()) {
            if ('tags' in item.data) {
                const tags = item.data.tags;
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

    config.addFilter('filterLastArticle', (array) => {
        let lastElement = [];
        lastElement.push(array[array.length - 1]);
        return lastElement;
    });

    config.addFilter('limit', (array, limit) => {
        return array.slice(0, limit);
    });

    config.addFilter('filterArticles', (array) => {
        return array.filter(post =>
            post.inputPath.startsWith('./src/articles/')
        );
    });

    config.addFilter('filterCurrentPage', (array, page) => {
        return array.filter(post =>
            post.url != page.url
        );
    });

    config.addFilter('markdown', (value) => {
        let markdown = require('markdown-it')({
            html: true
        });
        return markdown.render(value);
    });

    config.addFilter('fixLinks', (content) => {
        const reg = /(src="[^(https:\/\/)])|(src="\/)|(href="[^(https:\/\/)])|(href="\/)/g;
        const prefix = `https://tips.mefody.dev` + content.url;
        return content.templateContent.replace(reg, (match) => {
            if (match === `src="/` || match === `href="/`) {
                match = match.slice(0, -1);
                return match + prefix;
            } else {
                return match.slice(0, -1) + prefix + match.slice(-1);
            }
        });
    });

    // Transforms

    config.addTransform('htmlmin', (content, outputPath) => {
        if (outputPath && outputPath.endsWith('.html')) {
            let htmlmin = require('html-minifier');
            let result = htmlmin.minify(
                content,
                {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true
                }
            );
            return result;
        }
        return content;
    });

    config.addTransform('xmlmin', function(content, outputPath) {
        if (outputPath && outputPath.endsWith('.xml')) {
            let prettydata = require('pretty-data');
            let result = prettydata.pd.xmlmin(content);
            return result;
        }
        return content;
    });

    return {
        dir: {
            input: 'src',
            output: 'public',
            includes: 'includes',
            layouts: 'layouts',
            data: 'data',
        },
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: false,
        htmlTemplateEngine: 'njk',
        passthroughFileCopy: true,
        templateFormats: [
            'md', 'njk'
        ],
    };
};
