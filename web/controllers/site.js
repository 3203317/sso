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

exports.authUI = function(req, res, next){
	var domain = req.query.domain;
	var redirect = req.query.redirect;

	if(!redirect || !redirect.trim().length){
		req.flash('error', 'I need redirect.');
	}

	if(2 === req.session.lv){
		return res.render('Auth', {
			title: title,
			description: '',
			keywords: ',sso,css,javascript,html',
			virtualPath: virtualPath,
			error: req.flash('error').toString(),
			redirect: redirect,
			cdn: conf.cdn
		});
	}

	var params = {
		domain: domain,
		redirect: redirect
	};
	res.redirect('/u/login?'+ qs.stringify(params));
};