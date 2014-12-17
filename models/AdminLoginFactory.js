var
	Async = require('async'),
	Status = require(appRoot + '/models/DataObj/Status'),
	RoleList = require(appRoot + '/models/DataObj/RoleList'),
	DALMyAdminLogin = require(appRoot + '/models/DAL/DALMyAdminLogin'),
	DALMyAdminMapping = require(appRoot + '/models/DAL/DALMyAdminMapping'),
	DALMyAdminRole = require(appRoot + '/models/DAL/DALMyAdminRole'),
	AdminLogin = require(appRoot + '/models/DataObj/AdminLogin'),
	UtilTool = require(appRoot + '/models/UtilTool');	

var 
	dalLogin = new DALMyAdminLogin(),
	dalMapping = new DALMyAdminMapping(),
	dalRole = new DALMyAdminRole(),
	loginObj = new AdminLogin(),
	tool = new UtilTool();

var AdminLoignFactory = function(){

};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.createUser = function(username, password, nickname, roleIDs, createbyid, result){
	Async.waterfall([ 
	function(callback) {
		loginObj.set(username, password, nickname, createbyid, callback);
	}, 
	function(loginObj, callback) {
		dalLogin.getByUserName(loginObj.username, function(err, obj){
			if(err){
				callback(err, 'Check user failed');
			}else{				
				if(obj.length > 0){					
					callback(null, 'User already exists');
				}else{
					callback(null, loginObj);
				}				
			}
		});
	},
	function(loginObj, callback) {		
		if(loginObj instanceof AdminLogin){
			dalLogin.insert(loginObj, function(err, data){
				if(err){
					callback(null, 'Create user failed');
				}else{
					callback(null, { id: data.id });
				}
		    });
		}else{
			callback(null, loginObj);
		}
    }, 
    function(obj, callback) {
		if(typeof obj === 'string'){
			callback(null, obj, false, null);
		}else{
			var insertObj = [];
			
			function each(row, next) {
				insertObj.push([obj.id, row]);
				next(null);		    	
		    }

		    function done() {
		    	dalMapping.insertRole(insertObj, function(err, data){
					if(err){
						callback(null, 'Create user failed', false, err);
					}else{
						callback(null, '', true, obj.id);
					}					
				});
		    }
		    
	    	Async.eachSeries(roleIDs, each, done);
		}
    }, 
    function(msg, flag, data, callback) {
    	var statusObj = new Status();
    	statusObj.set(flag, msg, data, callback);
    },
    function(statusObj, callback) {
    	result(null, statusObj);
    	callback(null, 'Done');
    }], function(err, result) {
			if (err) {
				var obj = {
					err : err,
					result : result
				};
				result(obj, null);
			}
	});
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.getList = function(page, itemPerPage, result){	
	
	Async.waterfall([	   
	function(callback) {
		dalLogin.getList(page, itemPerPage, function(err, data){
			if(err){
				callback(null, 'Get data Failed', false, err);
			}else{
				if(data.paging.totalItem > 0){	    			
	    			callback(null, '', true, data);
	    		}else{
	    			callback(null, 'Data not found', false, data);
	    		}
			}
		});
	}, 
	function(msg, flag, data, callback) {
		var statusObj = new Status();
		statusObj.set(flag, msg, data, callback);
	},
	function(statusObj, callback) {
		result(null, statusObj);
		callback(null, 'done');
	}], function(err, resultObj) {
		if (err) {
			var obj = {
					err : err,
					result : resultObj
			};
			result(obj, null);
		}
	});
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.verify = function(username, pw, result){	
	Async.waterfall([	   
	function(callback) {
		dalLogin.getByUserName(username, function(err, data){
			if(err){				
				callback(null, 'Get data Failed', null);
			}else{
				if(data.length > 0){	
					var pwHash = tool.getSHA256Hash(pw);
					if(pwHash == data[0].UserPass){
						callback(null, data[0]);
					}else{
						callback(null, 'Access denied');
					}
	    		}else{
	    			callback(null, 'User not found');
	    		}
			}
		});
	},
	function(user, callback) {
		if(typeof user === 'string'){
			callback(null, user, null);
		}else{
			dalMapping.getList(user.ID, function(err, data){
				if(err){
					callback(null, 'Get data Failed', null);
				}else{
					var roleIDs = new Array(data.length);
					for(var key in data){
						roleIDs[key] = data[key].RoleID;
					}
					callback(null, user, roleIDs);
				}
			});
		}
	},
	function(user, roleIDs, callback) {
		if(typeof user === 'string'){
			callback(null, user, false, null);
		}else{
			var updObj = {
				LastLoginDate : tool.getNowDateString()
			};
			dalLogin.update(user.ID, updObj, function(err, data){
				var obj = {
					id: user.ID,
					username: user.UserName,
					nickname: user.NickName,
					roles: roleIDs,
					photo: user.ProfilePhoto
				};
				callback(null, '', true, obj);						
			});
		}
	},
	function(msg, flag, data, callback) {
		var statusObj = new Status();
		statusObj.set(flag, msg, data, callback);
	},
	function(statusObj, callback) {
		result(null, statusObj);
		callback(null, 'done');
	}], function(err, resultObj) {
		if (err) {
			var obj = {
					err : err,
					result : resultObj
			};
			result(obj, null);
		}
	});
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.getData = function(id, result){	
	Async.waterfall([	   
	function(callback) {
		dalLogin.getData(id, function(err, data){	
			if(err){
				callback(null, 'Get data Failed');
			}else{
				if(data.length > 0){						
					callback(null, data[0]);					
	    		}else{
	    			callback(null, 'User not found');
	    		}
			}
		});
	},
	function(user, callback) {		
		if(typeof user === 'string'){
			callback(null, user, false, null);
		}else{
			callback(null, '', true, user);
		}
	},
	function(msg, flag, data, callback) {
		var statusObj = new Status();
		statusObj.set(flag, msg, data, callback);
	},
	function(statusObj, callback) {
		result(null, statusObj);
		callback(null, 'done');
	}], function(err, resultObj) {
		if (err) {
			var obj = {
					err : err,
					result : resultObj
			};
			result(obj, null);
		}
	});
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.enableUser = function(id, isActive, result){	
	Async.waterfall([
	function(callback) {
		var updObj = {
			IsActive : parseInt(isActive)
		};
		
		dalLogin.update(id, updObj, function(err, data){
			if(err){
				callback(null, 'Change failed', false, err);
			}else{
				callback(null, '', true, data);
			}					
		});
	},
	function(msg, flag, data, callback) {
		var statusObj = new Status();
		statusObj.set(flag, msg, data, callback);
	},
	function(statusObj, callback) {
		result(null, statusObj);
		callback(null, 'done');
	}], function(err, resultObj) {
		if (err) {
			var obj = {
					err : err,
					result : resultObj
			};
			result(obj, null);
		}
	});
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.getRoleListInit = function(id, callback) {
	var treeSet = [];
	
	dalRole.getList(id, function (err, rows) {
		if(err){
			callback(treeSet);
		}else{
			function each(row, next) {
			    AdminLoignFactory.prototype.getRoleListInit(row.ID, function (children) {
			    	var role = new RoleList();
					role.set(row.ID, row.UserRoleDesc, false, children, function(roleData){
						treeSet.push(roleData);
					});
							    			
		    		next(null);
		    	});
		    }

		    function done() {
		    	callback(treeSet);
		    }
	    	Async.eachSeries(rows, each, done);
		}
    });	
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.getRoleList = function(id, pid, callback) {
	var treeSet = [];
	
	dalRole.getUserRoleList(id, pid, function (err, rows) {
		if(err){
			callback(treeSet);
		}else{
			function each(row, next) {
			    AdminLoignFactory.prototype.getRoleList(id, row.ID, function (children) {
			    	var role = new RoleList();
					role.set(row.ID, row.UserRoleDesc, row.MID, children, function(roleData){
						treeSet.push(roleData);
					});
							    			
		    		next(null);
		    	});
		    }

		    function done() {
		    	callback(treeSet);
		    }
	    	Async.eachSeries(rows, each, done);
		}
    });	
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.updUser = function(userid, nickname, roleIDs, result){
	Async.waterfall([
	function(callback) {		
		var updObj = {
			NickName : nickname
		};
			
		dalLogin.update(userid, updObj, function(err, data){
			if(err){
				callback(null, 'Change failed');
			}else{
				callback(null, {id: userid});
			}					
		});		
    }, 
    function(obj, callback) {
		if(typeof obj === 'string'){
			callback(null, obj);
		}else{			
			dalMapping.removeAllRole(obj.id, function(err, data){
				if(err){
					callback(null, 'Change failed');
				}else{
					callback(null, obj);
				}					
			});
		}
    }, 
    function(obj, callback) {
		if(typeof obj === 'string'){
			callback(null, obj, false, null);
		}else{
			var insertObj = [];
			
			function each(row, next) {
				insertObj.push([obj.id, row]);
				next(null);		    	
		    }

		    function done() {
		    	dalMapping.insertRole(insertObj, function(err, data){
					if(err){
						callback(null, 'Change failed', false, err);
					}else{
						callback(null, '', true, obj.id);
					}					
				});
		    }
		    
	    	Async.eachSeries(roleIDs, each, done);
		}
    }, 
    function(msg, flag, data, callback) {
    	var statusObj = new Status();
    	statusObj.set(flag, msg, data, callback);
    },
    function(statusObj, callback) {
    	result(null, statusObj);
    	callback(null, 'Done');
    }], function(err, result) {
			if (err) {
				var obj = {
					err : err,
					result : result
				};
				result(obj, null);
			}
	});
};

module.exports = AdminLoignFactory;
