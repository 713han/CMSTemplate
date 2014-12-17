var 
	Moment = require('moment'),
	UtilTool = require(appRoot + '/models/UtilTool'),
	Status = require(appRoot + '/models/DataObj/Status'),
	AdminLoginFactory = require(appRoot + '/models/AdminLoginFactory');

var 
	tool = new UtilTool();
	loginFact = new AdminLoginFactory();

var SysController = function(){
	
};

SysController.prototype.createUserForm = function(req, res){
	
	var viewData = {
		identify:'SysCreateUser',
		menu:'SysCreateUser',
		title: 'Create',
		userName: req.user.nickname
	};
	res.render('Sys/createuser',viewData);
};

SysController.prototype.createUser = function(req, res){
	var 
		username = req.body.username,
		password = req.body.password,
		nickname = req.body.nickname,
		roleIDs = req.body.roleIDs,
		createdByID = req.user.id;
	
	if((typeof username === 'undefined')&&
	   (typeof password === 'undefined')&&
	   (typeof nickname === 'undefined'))
	{
		var obj = new Status();
		obj.set(false, 'field undefined', '', function(err, obj){
			res.send(obj);
		});
	}else{
		loginFact.createUser(username, password, nickname, roleIDs, createdByID, function(err, obj){
			res.send(obj);
		});
	}	
};

SysController.prototype.getListForm = function(req, res){
	var page = req.params.page || 1;
	var itemPerPage = 1;
	
	loginFact.getList(page, itemPerPage, function(err, obj){
		if(err){
			res.send(err);
		}else{
			var viewData = {
				identify:'SysUserList',
				menu:'SysUserList',
				title: 'List',
				userName: req.user.nickname		
			};
			res.render('Sys/userlist',viewData);
		}
	});
};

SysController.prototype.getList = function(req, res){
	var page = req.body.page || 1;
	var itemPerPage = 5;
	
	loginFact.getList(page, itemPerPage, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

SysController.prototype.enableUser = function(req, res){
	var 
		id = req.body.id,
		isActive = req.body.active;		
	
	if((typeof id === 'undefined')&&
	   (typeof isActive === 'undefined'))
	{
		var obj = new Status();
		obj.set(false, 'field undefined', '', function(err, obj){
			res.send(obj);
		});
	}else{
		loginFact.enableUser(id, isActive, function(err, obj){
			res.send(obj);
		});
	}	
};

SysController.prototype.getProfile = function(req, res){
	var id = req.params.id;
	loginFact.getData(id, function(err, result){
		var viewData = {		
				identify:'SysProfile',
				menu:'SysUserList',
				title: 'Profile',
				userID: result.Object.ID,
				userNickName: result.Object.NickName,
				userName: result.Object.UserName,
				userCreateByName: result.Object.CreateByName || 'System',
				userIsActive: (result.Object.IsActive[0] == 1) ? true : false,
				userCreateDate: Moment(result.Object.CreateDate).format('YYYY-MM-DD HH:mm:ss'),
				userLastLoginDate: Moment(result.Object.LastLoginDate).format('YYYY-MM-DD HH:mm:ss'),
				profilePhoto: result.Object.ProfilePhoto || '/EventsAdmin/assets/images/RD2-1.png'				
		};
		res.render('Sys/profile', viewData);
		
	});
	
};

SysController.prototype.setProfile = function(req, res){
	var userid = req.body.userid;
	var nickname = req.body.nickname;
	var roleIDs = req.body.roleIDs;
	
	loginFact.updUser(userid, nickname, roleIDs, function(err, result){
		res.send(result);
	});
};

SysController.prototype.getRoleListInit = function(req, res){
	var parentId = req.params.pid;
	
	loginFact.getRoleListInit(parentId, function(obj){
		res.send(obj);
	});
};

SysController.prototype.getRoleList = function(req, res){
	var loginId = req.params.id;
	var parentId = req.params.pid;
	
	loginFact.getRoleList(loginId, parentId, function(obj){
		res.send(obj);
	});
};

module.exports = SysController;