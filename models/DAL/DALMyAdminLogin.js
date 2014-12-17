var  
	DALMySqlBasic = require(appRoot + '/models/DAL/DALMySqlBasic'),
	Util = require('util');

var DALMyAdminLogin = function(){
	this.tableName = 'AdminLogin';		
};
Util.inherits(DALMyAdminLogin, DALMySqlBasic); //繼承

/*
 * result:function(err, obj);
 */
DALMyAdminLogin.prototype.insert = function(AdminLoginObj, result){
	
	var insertObj ={
		username : AdminLoginObj.username,
		userpass : AdminLoginObj.userpass,
		userstatus : AdminLoginObj.userstatus,
		createbyid : AdminLoginObj.createbyid,
		isactive : AdminLoginObj.isactive,
		passerror : AdminLoginObj.passerror,
		lastlogindate : AdminLoginObj.lastlogindate,
		profilephoto : AdminLoginObj.profilephoto,
		nickname : AdminLoginObj.nickname
	};
	
	DALMyAdminLogin.super_.prototype.insert(this.tableName, insertObj, function(err, obj){		
		if(err){
			result(err, null);
		}else{			
			AdminLoginObj.setid(obj.insertId, function(err, obj){
				result(null, obj);
			});			
		}
	});		
};

DALMyAdminLogin.prototype.update = function(id, updObj, result){	
	DALMyAdminLogin.super_.prototype.update(this.tableName, id, updObj, result);		
};

DALMyAdminLogin.prototype.getData = function(id, result){	
	var table = this.tableName;
	
	var sql = 'SELECT m.*, c.nickname as CreateByName FROM `' + table + '` m '
			+ 'LEFT JOIN (SELECT id, nickname FROM `' + table + '` ) c '
			+ '	ON m.createByID = c.id '
		    + 'WHERE m.id = ? ';

	var defErrMsg = 'Cannot found';
	DALMyAdminLogin.super_.prototype.executeSQL(sql, id, defErrMsg, result);
	
};

DALMyAdminLogin.prototype.getList = function(page, itemPerPage, result){
	var table = this.tableName;
	DALMyAdminLogin.super_.prototype.paging(table, itemPerPage, page, function(err, pagingObj){
		var sql = 'SELECT id, nickname, username, isactive, createdate, lastlogindate FROM `' + table + '` '
			    + 'WHERE userstatus = 1 ORDER BY id  LIMIT ' + pagingObj.startIndex + ', ' + pagingObj.itemPerPage ;
		var defErrMsg = 'Cannot found';
		DALMyAdminLogin.super_.prototype.executeSQL(sql, null, defErrMsg, function(err, data){
			if(err){
				result(err, data);
			}else{
				var resultData = {
					paging : pagingObj,
					result : data
				};
				result(null ,resultData);
			}
		});
	});
};

/*
 * result:function(err, obj);
 */
DALMyAdminLogin.prototype.getByUserName = function(username, result){		
	var sql = 'SELECT * FROM `' + this.tableName + '` WHERE UserName = ? and IsActive = 1';
	var defErrMsg = 'Cannot found';
	DALMyAdminLogin.super_.prototype.executeSQL(sql, username, defErrMsg, result);		
};

module.exports = DALMyAdminLogin;