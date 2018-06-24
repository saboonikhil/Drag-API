const CarDetail = require('../models/carDetail').CarDetail;

exports.carDetail_list = function(req, res) {
    CarDetail.find({}).sort({createdAt: -1}).exec(function(err,carDetails){
		if(err) return next(err);
		res.json(carDetails);
	});
};

exports.carDetail_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Car Detail: ' + req.params.id);
};

exports.carDetail_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Car Detail create GET');
};

exports.carDetail_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Car Detail create POST');
};

exports.carDetail_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Car Detail delete GET');
};

exports.carDetail_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Car Detail delete POST');
};

exports.carDetail_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Car Detail update GET');
};

exports.carDetail_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Car Detail update POST');
};