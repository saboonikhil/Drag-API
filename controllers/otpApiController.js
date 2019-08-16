const request = require('request');

exports.getOtp = function(req, res, next) {
    const number = req.body.contact;
    const API_URL = 'https://2factor.in/API/V1/7639c0f0-b4c6-11e9-ade6-0200cd936042/SMS/+91'.concat(number).concat('/AUTOGEN');
    request(API_URL, { json:true }, (err, response, body) => {
        if(err) return next(err);
        res.json(body); 
    });
}

exports.verifyOtp = function(req, res, next) {
    const otp = req.body.otp;
    const unique_id = req.body.uid;
    const API_VERIFY_URL = 'https://2factor.in/API/V1/7639c0f0-b4c6-11e9-ade6-0200cd936042/SMS/VERIFY/'.concat(unique_id).concat('/').concat(otp);
    request(API_VERIFY_URL, {json:true}, (err,response,body) => {
        if(err) return next(err);
        res.json(body);
    });
}