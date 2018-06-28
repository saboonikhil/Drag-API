const Cab = require('../models/cab').Cab;

exports.cab_list = function(req, res, next) {
    Cab.find({}).sort({createdAt: -1}).populate('driver').exec(function(err,cabs){
      if(err) return next(err);
      res.json(cabs);
  });
};

exports.add_cab = function(req, res, next) {
    const cab = new Cab(req.body);
    cab.populate('driver').save(function(err,cab){
        if(err) return next(err);
        res.status(201);
        res.json(cab);
    });
}

exports.cab_detail = function(req, res, next) {
    Cab.findById(req.params.cID).populate('driver').exec(function(err, result){
        if(err) return next(err);
        if(!result){
            err = new Error('Failed to load Cab');
            err.status = 404;
            return next(err);
        }
        req.cab = result;
        res.json(req.cab);
    });
};

exports.cab_update = function(req, res, next) {
    Cab.findById(req.params.cID).populate('driver').exec(function(err, result){
        if(err) return next(err);
        if(!result){
            err = new Error('Failed to load Cab');
            err.status = 404;
            return next(err);
        }
        req.cab = result;
        req.cab.update(req.body, function(err, result) {
            if(err) return next(err);
            res.json(result);
        });
    });
};

exports.cab_delete = function(req, res, next) {
    Cab.remove({_id: req.params.cID}, function(err,cab){     
        if(err) return next(err);
        res.json(cab);                         
    });
};