var UtilTool = require(appRoot + '/models/UtilTool');

var AdminLogin = function(){
	this.id = 0;
	this.username = '';
	this.userpass = '';
	this.userstatus = false;
	this.createdate = '';
	this.createbyid = 0;
	this.isactive = false;
	this.passerror = 0;
	this.lastlogindate = '1000-01-01 00:00:00';
	this.profilephoto = '';
	this.nickname = '';	
	
	this.tool = new UtilTool();
};

AdminLogin.prototype.set = function(username, password, nickname, createbyid, result){
	this.username = username;
	this.userpass = this.tool.getSHA256Hash(password);
	this.userstatus = true;	
	this.createbyid = createbyid;
	this.isactive = true;
	this.nickname = nickname;
	
	result(null, this);
};

AdminLogin.prototype.setid = function(id, result){
	this.id = id;
	
	result(null, this);
};

module.exports = AdminLogin;