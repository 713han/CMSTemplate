var  
	DALMySqlBasic = require(appRoot + '/models/DAL/DALMySqlBasic'),
	Util = require('util');

var DALMyAdminMapping = function(){
	this.tableName = 'AdminRoleMapping';		
};
Util.inherits(DALMyAdminMapping, DALMySqlBasic); //繼承

DALMyAdminMapping.prototype.getList = function(loginID, result){
	var table = this.tableName;
	
	var sql = 'SELECT * FROM `' + table + '` WHERE LoginID = ? ORDER BY id';
	var defErrMsg = 'Cannot found';
	
	DALMyAdminMapping.super_.prototype.executeSQL(sql, loginID, defErrMsg, function(err, data){
		if(err){
			result(err, data);
		}else{			
			result(null ,data);
		}
	});
};

DALMyAdminMapping.prototype.insertRole = function(roleIDs, result){
	var table = this.tableName;
	
	var sql = 'INSERT INTO `' + table + '` (LoginID, RoleID) VALUES ?';
	var defErrMsg = 'Failed to inserted';
	
	DALMyAdminMapping.super_.prototype.executeSQL(sql, [roleIDs], defErrMsg, function(err, data){
		if(err){
			result(err, data);
		}else{			
			result(null ,data);
		}
	});
};

DALMyAdminMapping.prototype.removeAllRole = function(loginID, result){
	var table = this.tableName;
	
	var sql = 'DELETE FROM `' + table + '` WHERE LoginID = ?';
	var defErrMsg = 'Failed to removed';
	
	DALMyAdminMapping.super_.prototype.executeSQL(sql, loginID, defErrMsg, function(err, data){

		if(err){
			result(err, data);
		}else{			
			result(null ,data);
		}
	});
};

module.exports = DALMyAdminMapping;