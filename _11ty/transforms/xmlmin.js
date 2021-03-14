const prettydata = require('pretty-data');

function xmlmin(content, outputPath) {
    if (outputPath && outputPath.endsWith('.xml')) {
        const result = prettydata.pd.xmlmin(content);
        return result;
    }
    return content;
}

module.exports = xmlmin;
