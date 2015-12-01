#!/usr/bin/env node


var root   = require('path').resolve(__dirname, '../');
var fs     = require('fs');
var path   = require('path');


if (fs.existsSync(root + '/lib/lychee/build/node/core.js') === false) {
	require(root + '/bin/configure.js');
}


var lychee = require(root + '/lib/lychee/build/node/core.js')(root);



/*
 * USAGE
 */

var _print_help = function() {

	console.log('                                                      ');
	console.info('lycheeJS ' + lychee.VERSION + ' Breeder');
	console.log('                                                      ');
	console.log('Usage: breeder [Action] [Platform]                    ');
	console.log('                                                      ');
	console.log('                                                      ');
	console.log('Available Actions:                                    ');
	console.log('   configure, fertilize                               ');
	console.log('                                                      ');
	console.log('Available Fertilizers:                                ');
	console.log('                                                      ');
	console.log('   html, node                                         ');
	console.log('                                                      ');
	console.log('                                                      ');
	console.log('Examples:                                             ');
	console.log('                                                      ');
	console.log('    cd myproject; breeder configure html;             ');
	console.log('    cd myproject; breeder fertilize html;             ');
	console.log('                                                      ');

};



var _settings = (function() {

	var settings = {
		action:   null,
		platform: null,
		project:  null
	};


	var raw_arg0 = process.argv[2] || '';
	var raw_arg1 = process.argv[3] || '';
	var raw_arg2 = process.argv[4] || '';

	if (raw_arg0.match(/configure|fertilize/g)) {
		settings.action = raw_arg0;
	}

	if (raw_arg1.match(/html|node/g)) {
		settings.platform = raw_arg1;
	}

	try {

		var stat = fs.lstatSync(raw_arg2);
		if (stat.isDirectory()) {
			settings.project = raw_arg2;
		}

	} catch(e) {
	}


	return settings;

})();



(function(project, action, platform) {

	/*
	 * IMPLEMENTATION
	 */

	if (project !== null && action !== null && platform !== null) {

		console.info('Starting Instance (' + process.pid + ') ... ');

		lychee.setEnvironment(new lychee.Environment({
			id:      'breeder',
			debug:   false,
			sandbox: false,
			build:   'breeder.Main',
			timeout: 1000,
			packages: [
				new lychee.Package('lychee', '/lib/lychee/lychee.pkg'),
				new lychee.Package('breeder', '/lib/breeder/lychee.pkg'),
				new lychee.Package('fertilizer', '/lib/fertilizer/lychee.pkg')
			],
			tags:     {
				platform: [ 'node' ]
			}
		}));


		lychee.init(function(sandbox) {

			if (sandbox !== null) {

				var lychee     = sandbox.lychee;
				var breeder    = sandbox.breeder;
				var fertilizer = sandbox.fertilizer;


				// Show less debug messages
				lychee.debug = true;


				// This allows using #MAIN in JSON files
				sandbox.MAIN = new breeder.Main({
					project:  project,
					action:   action,
					platform: platform
				});

				sandbox.MAIN.bind('destroy', function() {
					process.exit(0);
				});

				sandbox.MAIN.init();


				process.on('SIGHUP',  function() { sandbox.MAIN.destroy(); this.exit(1); });
				process.on('SIGINT',  function() { sandbox.MAIN.destroy(); this.exit(1); });
				process.on('SIGQUIT', function() { sandbox.MAIN.destroy(); this.exit(1); });
				process.on('SIGABRT', function() { sandbox.MAIN.destroy(); this.exit(1); });
				process.on('SIGTERM', function() { sandbox.MAIN.destroy(); this.exit(1); });
				process.on('error',   function() { sandbox.MAIN.destroy(); this.exit(1); });
				process.on('exit',    function() {});


				new lychee.Input({
					key:         true,
					keymodifier: true
				}).bind('escape', function() {

					console.warn('breeder: [ESC] pressed, exiting ...');
					sandbox.MAIN.destroy();

				}, this);

			} else {

				process.exit(1);

			}

		});

	} else {

		_print_help();

		process.exit(0);

	}

})(_settings.project, _settings.action, _settings.platform);

