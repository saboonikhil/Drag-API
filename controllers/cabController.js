const Cab = require('../models/cab').Cab;

exports.cab_list = function(req, res, next) {

		const startTime = req.query.startTime;

		const startTimeUpperLimit = new Date(startTime);
		startTimeUpperLimit.setHours(startTimeUpperLimit.getHours() + 12); // Considering that time fluctuation is allowed for +12hours
		const startTimeISOUpperLimit = startTimeUpperLimit.toISOString();

		const startTimeLowerLimit = new Date(startTime);
		startTimeLowerLimit.setHours(startTimeLowerLimit.getHours() - 12); // Considering that time fluctuation is allowed for -12hours
		var startTimeISOLowerLimit = startTimeLowerLimit.toISOString();

		if((new Date() - startTimeLowerLimit) > 0)
		{
			startTimeISOLowerLimit = new Date(startTime).toISOString();
		}	

        Cab.find({
        		collegeName: req.query.collegeName,
        		$and : [
        				{ $or : [ { pickup : null }, { pickup : req.query.pickup } ] },
        				{ $or : [ { drop : null }, { drop : req.query.drop } ] },
        				{ $or : [ { isBooked : false}, {isShared : true } ] },
        				{ $or : [ { startTime: { $lte : startTimeISOUpperLimit, $gte: startTimeISOLowerLimit} }, { startTime : null } ] }
    				   ],       		
        		seats: { $gte : req.query.seats},
        		}).sort({createdAt: -1}).populate('driver').exec(function(err, cabs){
        	if(err) return next(err);
        	const len = cabs.length;
        	if(len == 0)
        	{
        		res.status(201);
        		res.json({'response':"No cabs available", 'res': true});
        	}
        	else
        	{
        		res.json(cabs);
        		res.status(201);
        	}
    });
};

exports.add_cab = function(req, res, next) {
    const cab = new Cab(req.body);
    cab.populate('driver').save(function(err,cab){
        if(err) return next(err);
        res.status(201);
        res.json(cab);
    });
};

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
}