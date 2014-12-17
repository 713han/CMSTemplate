var
	UUID = require('node-uuid'),
	Async = require('async'),
	Passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,	
	AdminLoginFactory = require(appRoot + '/models/AdminLoginFactory');

var
	loginFact = new AdminLoginFactory();

Passport.use('local', new LocalStrategy(
	function (username, password, done) {
		loginFact.verify(username, password, function(err, result){
			if(err){
				return done(null, false, err);
			}else{
				if(result.status === true){
					return done(null, result.Object);
				}else{
					return done(null, false, result);
				}
			}				
		});
    }		
));



Passport.serializeUser(function (user, done) {
	//保存user物件至session
	done(null, user);//可以通过数据库方式操作
});

Passport.deserializeUser(function (user, done) {
	//解析session內的user物件
	done(null, user);//可以通过数据库方式操作
});

var HomeController = function(){
	
};

HomeController.prototype.homePage = function(req, res){
	res.redirect(global.HOME_DIR + '/Home/login');
};

HomeController.prototype.index = function(req, res){
	var viewData = {		
		identify:'componentsDemo',
		menu:'',
		title: 'Event Site Index',
		userName: req.user.nickname
	};
	res.render('Home/index',viewData);
};

HomeController.prototype.loginForm = function(req, res){
	var viewData = {
		identify:'login',
		title: 'Login'			
	};
	res.render('Home/login',viewData);
};

HomeController.prototype.login = function(req, res, next){
	/*
	Passport.authenticate('local', {
		successRedirect: global.HOME_DIR + '/Home/index',
		failureRedirect: global.HOME_DIR + '/Home/login',
		failureFlash: true
	}
	*/
	
	Passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { return res.send(info); }
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			//return res.redirect(global.HOME_DIR + '/Home/index');
			return res.send({ status: true, redirect: global.HOME_DIR + '/Home/index'});
			
		});
	})(req, res, next);
};

HomeController.prototype.logout = function(req, res){
	req.logout();
    res.redirect(global.HOME_DIR + '/Home/login');
};

module.exports = HomeController;