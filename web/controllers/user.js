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

exports.authUI = function(req, res, next){
	res.render('user/Auth', {
		title: title,
		description: '',
		keywords: ',sso,css,javascript,html',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.loginUI = function(req, res, next){
	var domain = req.query.domain;
	if(!domain || !domain.trim().length){
		return res.render('ErrPage', {
			title: title,
			description: '',
			keywords: ',sso,css,javascript,html',
			virtualPath: virtualPath,
			msg: 'domain',
			cdn: conf.cdn
		});
	}

	res.render('user/Login', {
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

exports.validate = function(req, res, next){
	if(2 === req.session.lv) return next();
	if(req.xhr){
		return res.send({
			success: false,
			code: 300,
			msg: '无权访问'
		});
	}

	var domain = req.query.domain;
	if(!domain || !domain.trim().length){
		return res.render('ErrPage', {
			title: title,
			description: '',
			keywords: ',sso,css,javascript,html',
			virtualPath: virtualPath,
			msg: 'domain',
			cdn: conf.cdn
		});
	}

	var redirect = req.query.redirect;
	if(!redirect || !redirect.trim().length){
		return res.render('ErrPage', {
			title: title,
			description: '',
			keywords: ',sso,css,javascript,html',
			virtualPath: virtualPath,
			msg: 'redirect',
			cdn: conf.cdn
		});
	}

	var params = {
		domain: domain,
		redirect: redirect
	};
	res.redirect('/u/login?'+ qs.stringify(params));
};