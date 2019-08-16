const request = require('request');

exports.getOtp = function(req, res, next) {
    const number = req.body.contact;
    const API_URL = 'https://2factor.in/API/V1/YOUR_2FACTOR_API_KEY/SMS/+91'.concat(number).concat('/AUTOGEN');
    request(API_URL, { json:true }, (err, response, body) => {
        if(err) return next(err);
        res.json(body); 
    });
}

exports.verifyOtp = function(req, res, next) {
    const otp = req.body.otp;
    const unique_id = req.body.uid;
    const API_VERIFY_URL = 'https://2factor.in/API/V1/YOUR_2FACTOR_API_KEY/SMS/VERIFY/'.concat(unique_id).concat('/').concat(otp);
    request(API_VERIFY_URL, {json:true}, (err,response,body) => {
        if(err) return next(err);
        res.json(body);
    });
}