// Source: https://localghost.dev/blog/automated-weekly-links-posts-with-raindrop-io-and-eleventy/

// Load .env variables with dotenv
require('dotenv').config();

const fetch = require('node-fetch');
const { format, subDays } = require('date-fns');
const fs = require('fs');

const collectionId = process.env.RAINDROP_COLLECTION_ID;
const token = process.env.RAINDROP_ACCESS_TOKEN;
const today = new Date();
const lastSaturday = subDays(today, 7);
const formattedLastSaturday = format(lastSaturday, 'yyyy-MM-dd');
const formattedToday = format(today, 'yyyy-MM-dd');
const prettyToday = format(today, 'dd MMMM yyyy');

async function fetchLinks() {
    const search = new URLSearchParams({
        search: `created:>${formattedLastSaturday}`,
    });
    const url = new URL(
        `https://api.raindrop.io/rest/v1/raindrops/${collectionId}`,
    );
    url.search = search;
    const rsp = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return rsp.json();
}

function writePost(raindrops) {
    const formattedLinks = raindrops.map((raindrop) => {
        const { link, title, excerpt, note } = raindrop;

        const description = note === '' ? excerpt : note;
        return `* [${title}](${link}) — ${description}`;
    });

    let postContent = fs.readFileSync(
        './_11ty/scripts/weekly-links-template.md',
        'utf8',
    );
    postContent = postContent.replace('{{date}}', formattedToday);
    postContent = postContent.replace('{{linksCount}}', raindrops.length);
    postContent = postContent.replace(
        '{{title}}',
        `'Weekly Links: ${prettyToday}'`,
    );
    postContent = postContent.replace('{{links}}', formattedLinks.join('\n'));
    fs.writeFileSync(`./src/chunks/weekly-${formattedToday}.md`, postContent);
}

function main() {
    fetchLinks().then((res) => {
        if (res.items.length === 0) {
            // biome-ignore lint/suspicious/noConsoleLog: Message on build
            console.log('No links found, exiting');
            return;
        }
        writePost(res.items);
    });
}

main();
