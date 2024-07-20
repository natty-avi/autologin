const puppeteer = require('puppeteer');
const pool = require('../config/db');


const loginToPartnerSite = async (partnerId) => {
    const result = await pool.query('SELECT * FROM partners WHERE id = $1', [partnerId]);
    const partner = result.rows[0];
    if (!partner) {
        throw new Error('Partner not found');
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(partner.login_url);

    await page.type(partner.username_selector, partner.username);
    await page.type(partner.password_selector, partner.password);

    await page.click(partner.login_button_selector);
    await page.waitForNavigation();
    
    // Take a screenshot or perform any other actions
    await page.screenshot({ path: 'screenshot.png' });

    await browser.close();
};

module.exports = loginToPartnerSite;
