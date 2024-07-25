import loginToPartnerSite from '../scripts/puppeteerLogin';

const loginToPartner = async (req, res) => {
    const { partnerId } = req.body;
    try {
        await loginToPartnerSite(partnerId);
        res.send('Login successful');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { loginToPartner };
