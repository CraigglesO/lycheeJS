#!/usr/bin/env node


var root   = require('path').resolve(__dirname, '../');
var fs     = require('fs');
var path   = require('path');


if (fs.existsSync(root + '/libraries/lychee/build/node/core.js') === false) {
	require(root + '/bin/configure.js');
}


var lychee = require(root + '/libraries/lychee/build/node/core.js')(root);



/*
 * USAGE
 */

var _print_help = function() {

	console.log('                                                           ');
	console.info('lycheeJS ' + lychee.VERSION + ' Breeder                   ');
	console.log('                                                           ');
	console.log('Usage: lycheejs-breeder [Action] [Platform] [Library]      ');
	console.log('                                                           ');
	console.log('                                                           ');
	console.log('Available Actions:                                         ');
	console.log('   init, pull, fertilize                      	            ');
	console.log('                                                           ');
	console.log('Available Fertilizers:                                     ');
	console.log('                                                           ');
	console.log('   html, html-nwjs, html-webview, node, node-sdl           ');
	console.log('                                                           ');
	console.log('                                                           ');
	console.log('Examples:                                                  ');
	console.log('                                                           ');
	console.log('    cd myproject;                                          ');
	console.log('    lycheejs-breeder init node;                            ');
	console.log('    lycheejs-breeder pull node/dist /libraries/harvester;  ');
	console.log('    lycheejs-breeder fertilize node/main;                  ');
	console.log('                                                           ');

};



var _settings = (function() {

	var settings = {
		action:   null,
		platform: null,
		target:   null,
		project:  null,
		library:  null
	};


	var raw_arg0 = process.argv[2] || '';
	var raw_arg1 = process.argv[3] || '';
	var raw_arg2 = process.argv[4] || '';
	var raw_arg3 = process.argv[5] || '';


	var tmp = null;
	if (raw_arg2.substr(0, 10) === '--project=') {
		tmp = raw_arg2.substr(10);
	} else if (raw_arg3.substr(0, 10) === '--project=') {
		tmp = raw_arg3.substr(10);
	}


	if (tmp !== null) {

		try {

			var stat1 = fs.lstatSync(tmp);
			if (stat1.isDirectory()) {
				settings.project = tmp;
			}

		} catch(e) {

			settings.project = null;

		}

	}


	if (raw_arg0 === 'init') {

		settings.action   = 'init';
		settings.platform = raw_arg1.split('/')[0] || null;
		settings.target   = raw_arg1.split('/')[1] || null;

	} else if (raw_arg0 === 'pull') {

		settings.action   = 'pull';
		settings.platform = raw_arg1.split('/')[0] || null;
		settings.target   = raw_arg1.split('/')[1] || null;

		try {

			var stat1 = fs.lstatSync(root + '/' + raw_arg2);
			var stat2 = fs.lstatSync(root + '/' + raw_arg2 + '/lychee.pkg');
			if (stat1.isDirectory() && stat2.isFile()) {
				settings.library = raw_arg2;
			}

		} catch(e) {

			settings.library = null;

		}


	} else if (raw_arg0 === 'fertilize') {

		settings.action = 'fertilize';
		settings.platform = raw_arg1.split('/')[0] || null;
		settings.target   = raw_arg1.split('/')[1] || null;

	}


	return settings;

})();

var _bootup = function(settings) {

	console.info('BOOTUP (' + process.pid + ')');

	lychee.setEnvironment(new lychee.Environment({
		id:      'breeder',
		debug:   false,
		sandbox: false,
		build:   'breeder.Main',
		timeout: 1000,
		packages: [
			new lychee.Package('lychee',     '/libraries/lychee/lychee.pkg'),
			new lychee.Package('breeder',    '/libraries/breeder/lychee.pkg'),
			new lychee.Package('fertilizer', '/libraries/fertilizer/lychee.pkg')
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
			sandbox.MAIN = new breeder.Main(settings);

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

			console.error('BOOTUP FAILURE');

			process.exit(1);

		}

	});

};



(function(settings) {

	/*
	 * IMPLEMENTATION
	 */

	var action       = settings.action;
	var has_action   = settings.action !== null;
	var has_platform = settings.platform !== null;
	var has_target   = settings.target !== null;
	var has_project  = settings.project !== null;
	var has_library  = settings.library !== null;


	if (action === 'init' && has_project && has_platform) {

		_bootup(settings);

	} else if (action === 'pull' && has_project && has_platform && has_target && has_library) {

		_bootup(settings);

	} else if (action === 'fertilize' && has_project && has_platform) {

		_bootup(settings);

	} else {

		console.error('PARAMETERS FAILURE');

		_print_help();

		process.exit(1);

	}

})(_settings);

