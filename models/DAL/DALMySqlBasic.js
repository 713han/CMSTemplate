var	
	Mysql = require('mysql'),
	Config = require(appRoot + '/config');

var DALMySqlBasic = function(){
		
};

/*
 * result:function(err, obj);
 */
DALMySqlBasic.prototype.insert = function(tableName, insertObj, result){	
	var sql = 'INSERT INTO `' + tableName + '` SET ?';
	var defErrMsg = 'Failed to inserted';
	DALMySqlBasic.prototype.executeSQL(sql, insertObj, defErrMsg, result);
};

/*
 * result:function(err, obj);
 */
DALMySqlBasic.prototype.remove = function(tableName, id, result){
	var sql = 'DELETE FROM `' + tableName + '` WHERE id = ?';
	var defErrMsg = 'Failed to removed';
	DALMySqlBasic.prototype.executeSQL(sql, id, defErrMsg, result);	
};

/*
 * result:function(err, obj);
 */
DALMySqlBasic.prototype.update = function(tableName, id, data, result){
	var sql = 'UPDATE `' + tableName + '` SET ? WHERE id = ?';
	var defErrMsg = 'Failed to updated';
	DALMySqlBasic.prototype.executeSQL(sql, [data, id], defErrMsg, result);			
};

/*
 * result:function(err, obj);
 */
DALMySqlBasic.prototype.getData = function(tableName, id, result){		
	var sql = 'SELECT * FROM `' + tableName + '` WHERE id = ?';
	var defErrMsg = 'Cannot found';
	DALMySqlBasic.prototype.executeSQL(sql, id, defErrMsg, result);		
};

/*
 * result:function(err, obj);
 */
DALMySqlBasic.prototype.getList = function(table, page, itemPerPage, result){
	
	DALMySqlBasic.prototype.paging(table, itemPerPage, page, function(err, pagingObj){
		var sql = 'SELECT * FROM `' + table + '` LIMIT ' + pagingObj.startIndex + ', ' + pagingObj.itemPerPage ;
		var defErrMsg = 'Cannot found';
		
		DALMySqlBasic.prototype.executeSQL(sql, null, defErrMsg, function(err, data){
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
DALMySqlBasic.prototype.executeSQL = function(strSQL, data, defErrMsg, result){
	connection = Mysql.createConnection(Config.MySqlConn);
	connection.connect();		
	connection.query(strSQL, data, function(error, resData){
		if (error) {										
			result(error, defErrMsg);
		} else {				
			result(null, resData);
		}
	});		
	connection.end();
};

DALMySqlBasic.prototype.paging = function(tableName, itemPerPage, currentPage, result){
	var countSql = 'SELECT count(id) as total_item FROM `' + tableName + '` ';
	currentPage = (currentPage < 1) ? 1 : currentPage;
	
	DALMySqlBasic.prototype.executeSQL(countSql, null, null, function(err, data){
		if(err){
			var obj = {
				itemPerPage : itemPerPage,
				startIndex : (currentPage -1) * itemPerPage,
				totalItem : 0,
				currentPage : currentPage,
				totalPage : 1
			};
			result(null, obj);
		}else{
			var obj = {
				itemPerPage : itemPerPage,
				startIndex : (currentPage -1) * itemPerPage,
				totalItem : data[0].total_item,
				currentPage : currentPage,
				totalPage : Math.ceil(data[0].total_item / itemPerPage)
			};
			result(null, obj);
		}		
	});	
};

module.exports = DALMySqlBasic;