const CarDetail = require('../models/carDetail').CarDetail;

exports.carDetail_list = function(req, res) {
    CarDetail.find({}).sort({createdAt: -1}).exec(function(err,carDetails){
		if(err) return next(err);
		res.json(carDetails);
	});
};

exports.add_car_detail = function(req,res) {
    const carDetail = new CarDetail(req.body);
    carDetail.save(function(err,carDetail){
        if(err) return next(err);
        res.status(201);
        res.json(carDetail);
    });
}

exports.car_detail = function(req, res) {
    res.json(req.carDetail);
};

exports.car_update = function(req, res) {
    req.carDetail.update(req.body, function(err, result) {
        if(err) return next(err);
        res.json(result);
    });
};

exports.car_delete = function(req, res) {
    req.carDetail.remove(function(err,carDetail){     
            if(err) return next(err);
            res.json(carDetail);                         
    });
};