const request = require('request');

function twoFactorKey() {
    const key = process.env.TWO_FACTOR_API_KEY;
    if (!key) {
        throw new Error('TWO_FACTOR_API_KEY is required');
    }
    return key;
}

exports.getOtp = function(req, res, next) {
    const number = req.body.contact;
    const API_URL = 'https://2factor.in/API/V1/' + twoFactorKey() + '/SMS/+91'.concat(number).concat('/AUTOGEN');
    request(API_URL, { json:true }, (err, response, body) => {
        if(err) return next(err);
        res.json(body); 
    });
}

exports.verifyOtp = function(req, res, next) {
    const otp = req.body.otp;
    const unique_id = req.body.uid;
    const API_VERIFY_URL = 'https://2factor.in/API/V1/' + twoFactorKey() + '/SMS/VERIFY/'.concat(unique_id).concat('/').concat(otp);
    request(API_VERIFY_URL, {json:true}, (err,response,body) => {
        if(err) return next(err);
        res.json(body);
    });
}
