/*!
 * sso
 * Copyright(c) 2015 sso <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '12345',
	database:'cppt',
	port: 22306
});

var md5 = require('../lib/md5');

/**
 * 用户登陆
 *
 * @params {Object} logInfo 用户登陆信息
 * @params {Function} cb 回调函数
 * @return
 */
exports.login = function(logInfo, cb){
	pool.getConnection(function (err, conn){
		if(err) throw err;
		conn.query('SELECT t.* FROM (SELECT b.*, a.TENANT_NAME FROM s_tenant a, s_tenantuser b WHERE a.id=b.TENANT_ID AND b.STATUS=1) t WHERE t.TENANT_NAME=? and t.USER_NAME=?',
			[logInfo[0], logInfo[1]],
			function (err, rows, fields){
			conn.release();
			if(err) throw err;
			if(0 === rows.length){
				return cb(null, 3, ['用户名或密码输入错误，请重试！', 'username'], null);
			}
			if(md5.hex(logInfo[2]) !== rows[0].PASSWORD){
				return cb(null, 6, ['用户名或密码输入错误，请重试！', 'password'], rows[0]);
			}
			cb(null, 0, null, rows[0]);
		});
	});
};