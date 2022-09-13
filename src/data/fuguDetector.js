/* eslint-disable require-await */
/* eslint-disable no-console */
const EleventyFetch = require('@11ty/eleventy-fetch');

module.exports = async function () {
    try {
        const url = 'https://fugu-tracker.web.app/js/data.json';
        const data = await EleventyFetch(url, {
            duration: '1d',
            type: 'json',
        });

        const allApis = [];
        for (let key in data.rows) {
            allApis.push(
                ...data.rows[key].map((row) => {
                    row.status = key;
                    return row;
                }),
            );
        }

        return allApis;
    } catch (e) {
        return [];
    }
};
