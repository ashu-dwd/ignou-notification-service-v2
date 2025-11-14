const axios = require('axios');
const cheerio = require('cheerio');
const { saveNotification } = require('./saveToDB');
const logger = require('../utils/logger');

// Constants
const BASE_URL = 'https://www.ignou.ac.in/announcements/0?nav=6';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

/**
 * Clean and format text content from modal
 * @param {string} rawText - Raw text from modal
 * @returns {string} - Cleaned and formatted text
 */
const cleanModalText = (rawText) => {
    return rawText
        .replace(/\s{2,}/g, ' ')         // Collapse extra spaces
        .replace(/\n\s*\n+/g, '\n')      // Remove excessive newlines
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
};

/**
 * Extract links from modal content
 * @param {Cheerio} $ - Cheerio instance
 * @param {Cheerio} modal - Cheerio modal element
 * @param {string} baseUrl - Base URL for resolving relative links
 * @returns {string} - Formatted links string
 */
const extractModalLinks = ($, modal, baseUrl) => {
    const links = [];
    modal.find('.modal-body a').each((_, a) => {
        const text = $(a).text().trim();
        const href = $(a).attr('href');
        if (href) {
            const absoluteUrl = new URL(href, baseUrl).href;
            links.push(`- ${text}: [${absoluteUrl}]`);
        }
    });
    return links.length > 0 ? '\n\nAttachments:\n' + links.join('\n') : '';
};

/**
 * Process a single table row
 * @param {Cheerio} $ - Cheerio instance
 * @param {Cheerio} row - Table row element
 * @param {string} baseUrl - Base URL
 * @returns {Object|null} - Processed notification or null if invalid
 */
const processTableRow = ($, row, baseUrl) => {
    const tds = $(row).find('td');
    if (tds.length < 4) return null; // Skip incomplete rows

    const serial = $(tds[0]).text().trim();
    const issued_by = $(tds[1]).text().trim();
    const date = $(tds[3]).text().trim();

    // Extract modal content if available
    const modalTarget = $(tds[2]).find('a').attr('data-bs-target');
    let description = '';

    if (modalTarget) {
        const modal = $(modalTarget.trim());
        if (modal.length) {
            const rawText = modal.find('.modal-body').text();
            description = cleanModalText(rawText);
            description += extractModalLinks($, modal, baseUrl);
        }
    }

    if (serial && issued_by && date && description) {
        return {
            title: issued_by,
            time: date,
            description,
            source: 'IGNOU',
            scrapedAt: new Date()
        };
    }
    return null;
};

/**
 * Fetch and parse IGNOU announcements
 * @returns {Promise<Object>} - Result of saveNotification
 * @throws {Error} - If scraping fails
 */
const fetchTableNotifications = async () => {
    try {
        logger.info('Starting IGNOU announcements scrape');

        const response = await axios.get(BASE_URL, {
            timeout: REQUEST_TIMEOUT,
            headers: { 'User-Agent': USER_AGENT }
        });

        const $ = cheerio.load(response.data);
        const results = [];

        $('#announcement tbody tr').each((_, row) => {
            try {
                const notification = processTableRow($, row, BASE_URL);
                if (notification) {
                    results.push(notification);
                }
            } catch (rowError) {
                logger.error('Error processing table row:', rowError);
            }
        });

        logger.info(`Found ${results.length} valid announcements`);
        return await saveNotification(results);
    } catch (error) {
        logger.error('Failed to scrape IGNOU announcements:', error);
        throw new Error(`Scraping failed: ${error.message}`);
    }
};

/**
 * HTTP route handler for scraping notifications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const scrapeNotifications = async (req, res) => {
    try {
        const result = await fetchTableNotifications();
        logger.info('Successfully scraped notifications via HTTP');
        res.status(200).json(result);
    } catch (error) {
        logger.error('HTTP notification scrape failed:', error);
        res.status(500).json({
            error: 'Error scraping notifications',
            details: error.message
        });
    }
};

module.exports = {
    fetchTableNotifications,
    scrapeNotifications
};