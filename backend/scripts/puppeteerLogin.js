const puppeteer = require('puppeteer');
const pool = require('../config/db');
const bcrypt = require('bcrypt');

const loginToPartnerSite = async (partnerId) => {
    const result = await pool.query('SELECT * FROM partners WHERE id = $1', [partnerId]);
    const partner = result.rows[0];
    if (!partner) {
        throw new Error('Partner not found');
    }

    // Decrypt the password (if necessary)
    const isPasswordMatch = await bcrypt.compare(partner.password, storedHash); // Add stored hash
    if (!isPasswordMatch) {
        throw new Error('Invalid partner password');
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(partner.login_url);

    await page.type('#username', partner.username);
    await page.type('#password', partner.password);

    await page.click('#loginButton');
    await page.waitForNavigation();

    // Take a screenshot or perform any other actions
    await page.screenshot({ path: 'screenshot.png' });

    await browser.close();
};

module.exports = loginToPartnerSite;
