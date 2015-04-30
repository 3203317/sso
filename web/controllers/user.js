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

var User = require('../biz/user');

exports.loginUI = function(req, res, next){
	var domain = req.query.domain;
	if(!domain || !domain.trim().length){
		return res.render('ErrPage', {
			title: title,
			description: '',
			keywords: ',sso,css,javascript,html',
			virtualPath: virtualPath,
			error: 'I need domain.',
			cdn: conf.cdn
		});
	}

	res.render('user/Login', {
		title: title,
		description: '',
		keywords: ',sso,css,javascript,html',
		virtualPath: virtualPath,
		params: {
			domain: domain,
			redirect: req.query.redirect
		},
		error: req.flash('error').toString(),
		cdn: conf.cdn
	});
};

exports.auth = function(req, res, next){
	var data = req.query;
	var params = {
		domain: data.domain,
		redirect: data.redirect
	};

	User.login([
		data.domain,
		data.username,
		data.password
	], function (err, status, msg, doc){
		if(err) return next(err);
		if(!!status){
			req.flash('error', msg[0]);
			return res.redirect('/u/login?'+ qs.stringify(params));
		}
		/* session */
		req.session.lv = 2;
		req.session.domain = doc.TENANT_NAME;
		req.session.userId = doc.id;
		req.session.user = doc;
		/* result */
		res.redirect('/auth?'+ qs.stringify(params));
	});
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
};