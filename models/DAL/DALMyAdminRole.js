var  
	DALMySqlBasic = require(appRoot + '/models/DAL/DALMySqlBasic'),
	Util = require('util');

var DALMyAdminRole = function(){
	this.tableName = 'AdminRole';		
};
Util.inherits(DALMyAdminRole, DALMySqlBasic); //繼承

DALMyAdminRole.prototype.getList = function(parentID, result){
	var table = this.tableName;
	
	var sql = 'SELECT * FROM `' + table + '` WHERE IsActive = 1 and ParrentID =  ? ORDER BY id';
	var defErrMsg = 'Cannot found';
	
	DALMyAdminRole.super_.prototype.executeSQL(sql, parentID, defErrMsg, function(err, data){
		if(err){
			result(err, data);
		}else{			
			result(null ,data);
		}
	});
};

DALMyAdminRole.prototype.getUserRoleList = function(LoginID, parentID, result){
	var table = this.tableName;
	
	var sql = 'SELECT '
			+ '	r.ID, '
			+ ' r.UserRoleDesc, '
			+ '	m.ID AS MID '
			+ 'FROM `AdminRole` r '
			+ 'LEFT JOIN ( '
			+ '	SELECT ID, RoleID '
			+ '	FROM `AdminRoleMapping` ' 
			+ 'WHERE LoginID = ? ) m '
		    + 'ON r.id = m.RoleID '
		    + 'WHERE IsActive = 1 and ParrentID = ? ORDER BY r.ID';
	
	var defErrMsg = 'Cannot found';
	
	DALMyAdminRole.super_.prototype.executeSQL(sql, [LoginID, parentID], defErrMsg, function(err, data){
		if(err){
			result(err, data);
		}else{			
			result(null ,data);
		}
	});
};


module.exports = DALMyAdminRole;