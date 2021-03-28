const minifyXML = require('minify-xml').minify;

function xmlmin(content, outputPath) {
    if (outputPath && outputPath.endsWith('.xml')) {
        const result = minifyXML(content, {

        });
        return result;
    }
    return content;
}

module.exports = xmlmin;
