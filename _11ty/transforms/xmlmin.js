async function xmlmin(content, outputPath) {
    if (outputPath && outputPath.endsWith('.xml')) {
        const { minify: minifyXML } = await import('minify-xml');
        const result = minifyXML(content, {});
        return result;
    }
    return content;
}

module.exports = xmlmin;
