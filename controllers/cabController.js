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

exports.select_cab = function(req, res, next) {
    Cab.find({collegeName: req.params.college}, function(err, result){
        const len = result.length;
		if (len == 0) {
            if(err) return next(err);
			res.status(404);
			res.json({'message':"No cabs available", 'res': false});
        } else {
            res.status(100);
            var cabs = []; 
            var j = 0;
            if(req.params.pickup === "na") var location = req.params.drop;
            else var location = "na"; //hostel location assumed as "na", TODO: Connect with subPlace

            const time = req.params.time; //startDateTime in milliseconds
            const lowerLimit = time - 7200000;
            const upperLimit = time + 7200000;

            for(var i = 0; i < len; i++){
                if(result[i].drop == location && result[i].seats == req.params.seats) {
                    var startDateTime = result[i].startDate + " " + result[i].startTime + " GMT+0530";
                    var cabTime = Date.parse(startDateTime);
                    if(cabTime >= lowerLimit && cabTime <= upperLimit){
                        cabs[j] = result[i];
                        j++;
                    }
                }
            }
            if(j == 0){
                if(err) return next(err);
			    res.status(404);
			    res.json({'message':"No cabs available", 'res': false});
            } else {
                res.status(200).json(cabs);
            }
        }
    });
}