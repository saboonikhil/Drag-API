const Cab = require('../models/cab').Cab;

exports.cab_list = function(req, res, next) {
        Cab.find({
        		collegeName: req.query.collegeName,
        		$and : [
        				{ $or : [ { pickup : null }, { pickup : req.query.pickup } ] },
        				{ $or : [ { drop : null }, { drop : req.query.drop } ] },
        				{ $or : [ { isBooked : false}, {isShared : true } ] }
    				   ],
        		  //startDate: req.query.startDate,
        		  //startTime: req.query.startTime,
        		  seats: { $gte :req.query.seats},
        		  })
        		 .sort({createdAt: -1}).populate('driver').exec(function(err, cabs){
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
            /* 
    
                const time = req.query.time; //startDateTime in milliseconds
                const lowerLimit = time - 7200000;
                const upperLimit = time + 7200000;
    
                for(var i = 0; i < len; i++){
                    if(result[i].drop == location && result[i].seats == req.query.seats) {
                        var startDateTime = result[i].startDate + " " + result[i].startTime + " GMT+0530";
                        var cabTime = Date.parse(startDateTime);
                        if(cabTime >= lowerLimit && cabTime <= upperLimit){
                            cabs[j] = result[i];
                            j++;
                        }
                    }
                }
                */
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