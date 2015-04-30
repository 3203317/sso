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

	var redirect = req.query.redirect;
	if(!redirect || !redirect.trim().length){
		return res.render('ErrPage', {
			title: title,
			description: '',
			keywords: ',sso,css,javascript,html',
			virtualPath: virtualPath,
			error: 'I need redirect.',
			cdn: conf.cdn
		});
	}

	if(2 === req.session.lv){
		return res.render('Auth', {
			title: title,
			description: '',
			keywords: ',sso,css,javascript,html',
			virtualPath: virtualPath,
			cdn: conf.cdn
		});
	}

	var params = {
		domain: domain,
		redirect: redirect
	};
	res.redirect('/u/login?'+ qs.stringify(params));
};