const Driver = require('../models/driver').Driver;
const async = require('async');

exports.list_driver = function (req, res) {
    Driver.find({}).sort({ createdAt: -1 }).exec(function (err, driver) {
        if (err) return next(err);
        res.json(driver);
    });
};

exports.add_driver = function (req, res) {
    const driver = new Driver(req.body);
    driver.save(function (err, driver) {
        if (err) return next(err);
        res.status(201);
        res.json(driver);
    });
}

exports.driver_detail = function (req, res, next) {
    Driver.findById(req.params.id, function (err, result) {
        if (err) return next(err);
        if (!result) {
            err = new Error('Failed to load driver');
            err.status = 404;
            return next(err);
        }
        req.driver = result;
        res.json(req.params.id);
    });
};

exports.driver_update = function (req, res) {
    req.driver.update(req.body, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
};

exports.driver_delete = function (req, res) {
    req.driver.remove(function (err, driver) {
        if (err) return next(err);
        res.json(driver);
    });
};