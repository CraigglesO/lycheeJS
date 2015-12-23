#!/usr/bin/env node

var _root   = process.argv[2];
var _folder = __dirname.substr(_root.length);
var _port   = parseInt(process.argv[3], 10);
var _host   = process.argv[4] === 'null' ? null : process.argv[4];



/*
 * BOOTSTRAP
 */

require(_root + '/lib/lychee/build/node/core.js')(_root);
require(_root + '/lib/lychee/build/node/dist/index.js');



/*
 * INITIALIZATION
 */

(function(lychee, global) {

	var environment = new lychee.Environment({
		debug:    false,
		sandbox:  false,
		build:    'app.net.Server',
		packages: [
			new lychee.Package('app', _folder + '/lychee.pkg')
		],
		tags:     {
			platform: [ 'node' ]
		}
	});

	lychee.setEnvironment(environment);
	lychee.inject(lychee.ENVIRONMENTS['/lib/lychee/dist']);

	lychee.init(function(sandbox) {

		var lychee = sandbox.lychee;
		var app    = sandbox.app;

		sandbox.SERVER = new app.net.Server({
			host: _host,
			port: _port
		});

	});

})(lychee, typeof global !== 'undefined' ? global : this);

