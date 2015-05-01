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
	var redirect = req.query.redirect;

	if(!domain || !domain.trim().length){
		req.flash('error', 'I need domain.');
	} else if(!redirect || !redirect.trim().length){
		req.flash('error', 'I need redirect.');
	}

	res.render('user/Login', {
		title: title,
		description: '',
		keywords: ',sso,css,javascript,html',
		virtualPath: virtualPath,
		params: {
			domain: domain,
			redirect: redirect
		},
		error: req.flash('error')[0],
		cdn: conf.cdn
	});
};

exports.auth = function(req, res, next){
	var data = req.query;
	var domain = data.domain;
	var redirect = data.redirect;
	var username = data.username;
	var password = data.password;

	var params = {
		domain: domain,
		redirect: redirect
	};

	if(!domain || !domain.trim().length){
		req.flash('error', 'I need domain.');
		return res.redirect('/u/login?'+ qs.stringify(params));
	}

	if(!redirect || !redirect.trim().length){
		req.flash('error', 'I need redirect.');
		return res.redirect('/u/login?'+ qs.stringify(params));
	}

	if(!username || !username.trim().length){
		req.flash('error', '用户名不能为空，请输入！');
		return res.redirect('/u/login?'+ qs.stringify(params));
	}

	if(!password || !password.trim().length){
		req.flash('error', '密码不能为空，请输入！');
		return res.redirect('/u/login?'+ qs.stringify(params));
	}

	/* query my sql */
	User.login([
		domain,
		username,
		password
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
		req.session.username = doc.USER_NAME;
		/* success */
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