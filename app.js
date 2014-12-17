var Path = require('path');
global.appRoot = Path.resolve(__dirname);
global.HOME_DIR = '/EventsAdmin';

var Express = require('express'), 
	EjsEngine = require('ejs-locals'),
	Http = require('http'), 
	Fs = require('fs'),
	Cluster = require('cluster'),
	Favicon = require('serve-favicon'),	
	BodyParser = require('body-parser'),
	Morgan = require('morgan'),
	MethodOverride = require('method-override'),
	ErrorHandler = require('errorhandler'),
	CookieParser = require('cookie-parser'),
	Passport = require('passport'),
	Session = require('express-session'),
	Flash = require('connect-flash'),
	Log4js = require('log4js'),
	
	UtilTool = require(appRoot + '/models/UtilTool'),
	
	Home = require(appRoot + '/controller/HomeController'),
	Sys = require(appRoot + '/controller/SysController');

var app = Express(),
	applog  = Log4js.getLogger(),
	
	tool = new UtilTool(),
	
	home = new Home(),
	sys = new Sys();


// all environments
app.engine('ejs', EjsEngine);
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(new Favicon(__dirname + '/public/EventsAdmin/2010favicon.ico'));
app.use(new Morgan('tiny', {
	  "stream": {
		  write: function(str) { applog.info(str); }
	  }
	}));
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.use(new MethodOverride());
app.use(new CookieParser());
app.use(new Session({ secret: 'meir93fn58qknw83', 
				  resave: false,
				  saveUninitialized: true,
				  cookie: { maxAge: 1440000 }}));
app.use(new Flash());
app.use(Passport.initialize());
app.use(Passport.session());
app.use(global.HOME_DIR ,Express.static(Path.join(__dirname, 'public/EventsAdmin')));

app.locals.home = global.HOME_DIR;
app.locals.isInRole = isInRole;

// development only
if ('development' == app.get('env')) {
	app.use(new ErrorHandler());
}

Log4js.configure({ 
	"appenders": [{ "type": "dateFile",
					"filename": "logs/logfile.log",
					"pattern": "-yyyy-MM-dd",
					"alwaysIncludePattern": true
	              }]
});

function isAuth(req, res, next) {
    if (req.isAuthenticated()){
    	app.locals.roleIDs = req.user.roles;
    	app.locals.userProfilePhoto = req.user.photo || '/EventsAdmin/assets/images/RD2-1.png';
        return next();
	}
    res.redirect(global.HOME_DIR + '/home/login');
};

function isInRole(roles){
	for(var key in roles){
		var index = app.locals.roleIDs.indexOf(roles[key]);
		if(index >= 0){
			return true;
		}
	}
	return false;
};

app.param(function(name, fn) {
	if (fn instanceof RegExp) {
		return function(req, res, next, val) {
			var captures;
			if (captures = fn.exec(String(val))) {
				req.params[name] = captures;
				next();
			} else {
				next('route');
			}
		}
	}
});

app.route(global.HOME_DIR)
	.get(home.homePage);

app.route(global.HOME_DIR + '/Home')
	.get(home.homePage);

app.route(global.HOME_DIR + '/Home/login')
	.get(home.loginForm)
	.post(home.login);

app.route(global.HOME_DIR + '/Home/logout')
	.get(home.logout);

app.route(global.HOME_DIR + '/Home/index')
	.all(isAuth)
	.get(home.index);

app.route(global.HOME_DIR + '/Sys/createuser')
	.all(isAuth)
	.get(tool.checkRole([2],sys.createUserForm))
	.post(tool.checkRole([2],sys.createUser));

app.param('pid', /^\d+$/);
app.route(global.HOME_DIR + '/Sys/rolelistinit/:pid')
	.all(isAuth)
	.get(tool.checkRole([2],sys.getRoleListInit));

app.route(global.HOME_DIR + '/Sys/enableuser')
	.all(isAuth)
	.post(tool.checkRole([3],sys.enableUser));

app.route(global.HOME_DIR + '/Sys/userlist')
	.all(isAuth)
	.get(tool.checkRole([3],sys.getListForm))
	.post(tool.checkRole([3],sys.getList));	

app.param('id', /^\d+$/);
app.route(global.HOME_DIR + '/Sys/profile/:id')
	.all(isAuth)
	.get(tool.checkRole([3],sys.getProfile));

app.route(global.HOME_DIR + '/Sys/profile')
	.all(isAuth)
	.post(tool.checkRole([3],sys.setProfile));

app.param('id', /^\d+$/);
app.param('pid', /^\d+$/);
app.route(global.HOME_DIR + '/Sys/profile/rolelist/:pid/:id')
	.all(isAuth)
	.get(tool.checkRole([3],sys.getRoleList));


if (Cluster.isMaster) {
	var workers = {};
	
	process.title = 'EventSite Master';
	console.log(process.title + ' started');
	
	// 根據 CPU 個數來啟動相應數量的 worker
	for (var i = 0; i < 1; i++) {
		newThread();	
	}
	
	process.on('SIGHUP', function() {
		// master 進程忽略 SIGHUP 信號
	});

	Cluster.on('exit', function(worker) {
		delete workers[worker.process.pid];
		console.log('EventSite #' + worker.process.pid + ' worker died');
		newThread();
	});
	
	// 監測文件改動，如果有修改，就將所有的 worker kill 掉
	Fs.watch(__dirname, function(event, filename) {		
		killAllThread();
	});
	Fs.watch(__dirname + '/models', function(event, filename) {		
		killAllThread();
	});
	Fs.watch(__dirname + '/models/DAL', function(event, filename) {		
		killAllThread();
	});
	Fs.watch(__dirname + '/models/DataObj', function(event, filename) {		
		killAllThread();
	});
	Fs.watch(__dirname + '/controller', function(event, filename) {		
		killAllThread();
	});
	
	function newThread(){
		var worker = Cluster.fork();
		workers[worker.process.pid] = worker.id;
	}
	
	function killAllThread(){
		for(var pid in workers){
			Cluster.workers[workers[pid]].kill();	
			delete workers[pid];					
		}
	}
	
	
} else {
	process.title = 'EventSite@' + app.get('port') + ' #' + process.pid;
	console.log(process.title + ' worker started');

	process.on('SIGHUP', function() {
		// 接收到 SIGHUP 信號時，關閉 worker
		process.exit(0);
	});

	Http.createServer(app).listen(app.get('port'));
}

