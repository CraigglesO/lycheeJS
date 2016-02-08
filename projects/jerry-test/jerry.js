#!/usr/bin/lycheejs-helper env:jerry



/*
 * BOOTSTRAP
 */

var _root = process.argv[2];

require(_root + '/libraries/lychee/build/jerry/core.js')(__dirname);



/*
 * INITIALIZATION
 */

(function(lychee, global) {

	var environment = new lychee.Environment({
		debug:    true,
		sandbox:  false,
		build:    'app.Main',
		packages: [
			new lychee.Package('app', './lychee.pkg')
		],
		tags:     {
			platform: [ 'node' ]
		}
	});


	lychee.setEnvironment(environment);

	lychee.init(function(sandbox) {

		var lychee = sandbox.lychee;
		var app    = sandbox.app;

		sandbox.MAIN = new app.Main();

	});

})(lychee, typeof global !== 'undefined' ? global : this);

