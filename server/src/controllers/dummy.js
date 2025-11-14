const axios = require('axios');
const cheerio = require('cheerio');

const scrapeTableWithModals = async (url) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const results = [];

    $('#announcement tbody tr').each((_, row) => {
        const tds = $(row).find('td');

        const serial = $(tds[0]).text().trim();
        const issued_by = $(tds[1]).text().trim();
        const date = $(tds[3]).text().trim();

        const modalTarget = $(tds[2]).find('a').attr('data-bs-target');
        let description = '';

        if (modalTarget) {
            const modalSelector = modalTarget.trim();
            const modal = $(modalSelector);

            // Raw description text
            const rawText = modal.find('.modal-body').text();

            // Clean and normalize the modal body text
            const cleanedText = rawText
                .replace(/\s{2,}/g, ' ')          // collapse multiple spaces
                .replace(/\n\s*\n+/g, '\n')       // remove extra newlines
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => {
                    if (/notification/i.test(line)) return `- Notification: ${line}`;
                    if (/annexure\s*1/i.test(line)) return `- Annexure 1: ${line.replace(/annexure\s*1/i, '').trim()}`;
                    if (/annexure\s*2/i.test(line)) return `- Annexure 2: ${line.replace(/annexure\s*2/i, '').trim()}`;
                    return line;
                })
                .join('\n');

            // Get all links inside modal-body
            const links = [];
            modal.find('.modal-body a').each((_, a) => {
                const text = $(a).text().trim();
                const href = $(a).attr('href');
                if (href) {
                    const absoluteUrl = new URL(href, url).href;
                    links.push(`- ${text}: [${absoluteUrl}]`);
                }
            });

            // Combine cleaned description and links
            description = cleanedText;
            if (links.length > 0) {
                description += '\n\nAttachments:\n' + links.join('\n');
            }
        }

        if (serial && issued_by && date && description) {
            results.push({ serial, issued_by, date, description });
        }
    });

    return results;
};

// Run it
scrapeTableWithModals('https://www.ignou.ac.in/announcements/0?nav=6')
    .then(results => console.log(JSON.stringify(results, null, 2)))
    .catch(err => console.error('Error:', err));



//https://www.ignou.ac.in/announcements/0?nav=6






// const axios = require('axios');
// const cheerio = require('cheerio');

// const scrapeNotifications = async (baseUrl) => {
//     const { data } = await axios.get(baseUrl);
//     const $ = cheerio.load(data);
//     const results = [];

//     // The image shows that each announcement is a div with these specific classes.
//     // We are targeting these divs directly as the main announcement items.
//     $('.display-6.fs-6.text-start.border.rounded-1.border-success.mt-3.p-2').each((_, el) => {
//         // The title is found within an <h4> tag inside each announcement div.
//         const title = $(el).find('h4').text().trim();

//         // The description is within a div that has the class "announcement__text".
//         // We clone it to avoid modifying the original DOM element while processing links.
//         const descDiv = $(el).find('.announcement__text').first().clone();

//         // Iterate over any <a> tags found within the description div.
//         descDiv.find('a').each((_, a) => {
//             const text = $(a).text(); // Get the visible text of the link.
//             const href = $(a).attr('href'); // Get the href attribute.

//             // Construct the absolute URL. We add a check for 'href' to ensure it's not undefined
//             // before attempting to create a new URL object, preventing potential errors.
//             const absoluteUrl = href ? new URL(href, baseUrl).href : '';

//             // Replace the <a> tag with its text followed by the absolute URL in brackets.
//             $(a).replaceWith(`${text} [${absoluteUrl}]`);
//         });

//         // Get the cleaned text of the description after link processing.
//         const description = descDiv.text().trim();

//         // The time information is located within a <span> tag, which is inside a
//         // <div> with the 'align="right"' attribute.
//         const time = $(el)
//             .find('div[align="right"] span')
//             .text()
//             .replace(/[\[\]]/g, '') // Remove square brackets from the time string.
//             .trim();

//         // Only push to results if both title and description are present.
//         if (title && description) {
//             results.push({ title, description, time });
//         }
//     });

//     return results;
// };
// // Run it:
// scrapeNotifications('https://www.jeeadv.ac.in/').then((results) => {
//     console.log(results);
// });
