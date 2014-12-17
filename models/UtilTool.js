var 
	Moment = require('moment'),
	Crypto = require('crypto');

var UtilTool = function(){

};

UtilTool.prototype.getNowDateString = function(){
	return Moment().format('YYYY-MM-DD HH:mm:ss');
};

UtilTool.prototype.getSHA256Hash = function(string){
	var hash = Crypto.createHash('sha256').update(string).digest('base64');
	return hash;
};

UtilTool.prototype.checkRole = function (role, func){	
	return function(req, res, next){
		for(var key in role){
			var index = req.user.roles.indexOf(role[key]);
			if(index >= 0){
				return func(req, res, next);
			}
		}
		res.redirect(global.HOME_DIR + '/home/index');
	};
};

module.exports = UtilTool;