/*!
 * sso
 * Copyright(c) 2015 sso <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var conf = require('../settings'),
	EventProxy = require('eventproxy');

var fs = require('fs'),
	path = require('path'),
	cwd = process.cwd(),
	qs = require('querystring');

var title = 'SSO',
	virtualPath = '/';

exports.indexUI = function(req, res, next){
	res.render('Index', {
		title: title,
		description: '',
		keywords: ',sso,css,javascript,html',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.loginUI = function(req, res, next){
	res.render('Login', {
		title: title,
		description: '',
		keywords: ',sso,css,javascript,html',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.login = function(req, res, next){
	// TODO
};