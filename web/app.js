/*!
 * sso
 * Copyright(c) 2015 sso <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var express = require('express'),
	http = require('https'),
	path = require('path');

var cwd = process.cwd(),
	fs = require('fs');

var macros = require('./lib/macro');

var routes = require('./routes'),
	velocity = require('velocityjs');

/* session config */
var settings = require('./settings'),
	MongoStore = require('connect-mongo')(express),
	flash = require('connect-flash');

var app = express();

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

// all environments
app.set('port', process.env.PORT || 3000)
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'html')
	/* use */
	.use(flash())
	.use(express.favicon())
	.use(express.logger('dev'))
	.use(express.json())
	.use(express.urlencoded())
	.use(express.methodOverride())
	.use(express.cookieParser())
	.use(express.session({
		secret: settings.cookieSecret,
		key: settings.db,
		cookie: {
			maxAge: 1000 * 60 //60 second
		}, store: new MongoStore({
			// db: settings.db
			url: 'mongodb://'+ settings.user +':'+ settings.pass +'@'+ settings.host +':'+ settings.port +'/'+ settings.db
		})
	}))
	.use('/public', express.static(path.join(__dirname, 'public')))
	.use(app.router)
	/* velocity */
	.engine('.html', function (path, options, fn){
		fs.readFile(path, 'utf8', function (err, data){
			if(err) return fn(err);
			try{ fn(null, velocity.render(data, options, macros)); }
			catch(e){ fn(e); }
		});
	});

// development only
if('development' === app.get('env')){
	app.use(express.errorHandler());
}

http.createServer({
	key: fs.readFileSync('./ssl/privatekey.pem').toString(),
	cert: fs.readFileSync('./ssl/certificate.pem').toString(),
	ca: fs.readFileSync('./ssl/certrequest.csr').toString()
}, app).listen(app.get('port'), function(){
	console.log('Express server listening on port %s.', app.get('port'));
	routes(app);
});