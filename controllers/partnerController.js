const Partner = require('../models/partner').Partner;
const async = require('async');

exports.list_partner = function (req, res, next) {
    Partner.find({}).populate('cab').populate('user').sort({ createdAt: -1 }).exec(function (err, partners) {
        if (err) return next(err);
        res.json(partners);
    });
};

exports.add_partner = function (req, res, next) {
    const partner = new Partner(req.body);
    const partnerEmail = partner.partnerEmail;
    const partnerPassword = partner.partnerPassword;

    if(!(partnerEmail.indexOf("@")+1==partnerEmail.length))
    {
        if (partnerPassword.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && partnerPassword.length > 4 && partnerPassword.match(/[0-9]/) && partnerPassword.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) 
        {
            const temp =rand(160, 36);
            const newpass = temp + partnerPassword;
            const hashed_partnerPassword = crypto.createHash('sha512').update(newpass).digest("hex");
            partner.partnerPassword = hashed_partnerPassword;
            partner.salt = temp;

            Partner.find({partnerEmail: partnerEmail}, function(err, partners){
                const len = partners.length;
                if(len==0){
                    partner.populate('cab').populate('user').save(function(err,partner){
                        if(err) return next(err);
                        res.status(201);
                        res.json({'response':"Sucessfully Registered", 'res': true});
                    });
                }
                else
                {
                    res.status(401);
                    res.json({
                        'response': "Email already registered", 'res': false
                    });
                }
            });
        }
        else{
            res.status(401);
            res.json({
                'response': "Password weak", 'res': false
            });
        }
    }
    else{
        res.status(401);
        res.json({
            'response': "Email not valid", 'res': false
        });
    }   
}

exports.partner_detail = function (req, res, next) {
    Partner.findById(req.params.dID).populate('cab').populate('user').exec(function (err, result) {
        if (err) return next(err);
        if (!result) {
            err = new Error('Failed to load partner');
            err.status = 404;
            return next(err);
        }
        req.partner = result;
        res.json(req.partner);
    });
};

exports.partner_update = function (req, res, next) {
    Partner.findById(req.params.dID).populate('cab').populate('user').exec(function (err, result) {
        if (err) return next(err);
        if (!result) {
            err = new Error('Failed to load partner');
            err.status = 404;
            return next(err);
        }
        req.partner = result;
        req.partner.update(req.body, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });
};

exports.partner_delete = function (req, res, next) {
    Partner.remove({_id: req.params.dID}, function (err, partner) {
        if (err) return next(err);
        res.json(partner);
    });
};