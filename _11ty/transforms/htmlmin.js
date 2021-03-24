const htmlMinifier = require('html-minifier');

function htmlmin(content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
        const result = htmlMinifier.minify(
            content,
            {
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true,
            },
        );
        return result;
    }
    return content;
}

module.exports = htmlmin;
