module.exports = {
  paytm_config: {
    MID: process.env.PAYTM_MID || '',
    WEBSITE: process.env.PAYTM_WEBSITE || 'DEFAULT',
    CHANNEL_ID: process.env.PAYTM_CHANNEL_ID || 'WAP',
    INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID || 'Retail',
    MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY || ''
  }
}
