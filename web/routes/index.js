/*!
 * sso
 * Copyright(c) 2015 sso <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var site = require('../controllers/site'),
	user = require('../controllers/user');

var virtualPath = '',
	title = 'SSO',
	str1 = '参数异常';

module.exports = function(app){
	app.get('/', site.indexUI);

	app.get('/u/auth$', user.validate, user.authUI);
	app.post('/u/login$', valiPostData, user.login);
	app.get('/u/login$', user.loginUI);
};

/**
 * post数据校验
 *
 * @params {Object} 
 * @params {Object} 
 * @return {Object} 
 */
function valiPostData(req, res, next){
	var data = req.body.data;
	if(!data) return res.send({
		success: false,
		msg: str1
	});

	try{
		data = JSON.parse(data);
		if('object' === typeof data){
			req._data = data;
			return next();
		}
		res.send({
			success: false,
			msg: str1
		});
	}catch(ex){
		res.send({
			success: false,
			msg: ex.message
		});
	}
}

/**
 * get数据校验
 *
 * @params {Object} 
 * @params {Object} 
 * @return {Object} 
 */
function valiGetData(req, res, next){
	var data = req.query.data;
	if(!data) return next(new Error(str1));
	try{
		data = JSON.parse(data);
		if('object' === typeof data){
			req._data = data;
			return next();
		}
		next(new Error(str1));
	}catch(ex){
		next(new Error(ex.message));
	}
}