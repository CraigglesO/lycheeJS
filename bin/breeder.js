#!/usr/bin/lycheejs-helper env:node


var root = require('path').resolve(__dirname, '../');
var fs   = require('fs');
var path = require('path');


if (fs.existsSync(root + '/libraries/lychee/build/node/core.js') === false) {
	require(root + '/bin/configure.js');
}


var lychee = require(root + '/libraries/lychee/build/node/core.js')(root);



/*
 * USAGE
 */

var _print_help = function() {

	console.log('                                                            ');
	console.info('lycheeJS ' + lychee.VERSION + ' Breeder');
	console.log('                                                            ');
	console.log('Usage: lycheejs-breeder [Action] [Target] [Library/Project] ');
	console.log('                                                            ');
	console.log('                                                            ');
	console.log('Available Actions:                                          ');
	console.log('                                                            ');
	console.log('   init, pull, push                                         ');
	console.log('                                                            ');
	console.log('Examples:                                                   ');
	console.log('                                                            ');
	console.log('    cd /projects/my-project;                                ');
	console.log('                                                            ');
	console.log('    lycheejs-breeder init node;                             ');
	console.log('    lycheejs-breeder pull node/dist /libraries/harvester;   ');
	console.log('    lycheejs-breeder push node;                             ');
	console.log('                                                            ');

};



var _settings = (function() {

	var settings = {
		project:  null,
		action:   null,
		target:   null,
		library:  null
	};


	var raw_arg0 = process.argv[2] || '';
	var raw_arg1 = process.argv[3] || '';
	var raw_arg2 = process.argv[4] || '';
	var raw_arg3 = process.argv[5] || '';


	if (raw_arg3.substr(0, 10) === '--project=') {

		var tmp = raw_arg3.substr(10);
		if (tmp.indexOf('.') === -1) {

			try {

				var stat1 = fs.lstatSync(root + tmp);
				if (stat1.isDirectory()) {
					settings.project = tmp;
				}

			} catch(e) {

				settings.project = null;

			}

		}

	}


	// init node --project="/projects/my-project"
	if (raw_arg0 === 'init') {

		settings.action = 'init';
		settings.target = raw_arg1 || null;


	// pull node/dist /libraries/harvester --project="/projects/my-project"
	} else if (raw_arg0 === 'pull') {

		settings.action = 'pull';
		settings.target = raw_arg1 || null;

		try {

			var stat1 = fs.lstatSync(root + raw_arg2);
			var stat2 = fs.lstatSync(root + raw_arg2 + '/lychee.pkg');
			if (stat1.isDirectory() && stat2.isFile()) {
				settings.library = raw_arg2;
			}

		} catch(e) {

			settings.library = null;

		}

	// push --project="/projects/my-project"
	} else if (raw_arg0 === 'push') {

		settings.action = 'push';
		settings.target = raw_arg1 || null;

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

	var action      = settings.action;
	var has_project = settings.project !== null;
	var has_library = settings.library !== null;
	var has_target  = settings.target !== null;


	var platform = null;
	var target   = null;
	if (has_target) {
		platform = settings.target.split('/')[0] || null;
		target   = settings.target.split('/')[1] || null;
	}


	if (action === 'init' && has_project) {

		_bootup({
			action:  'init',
			project:  settings.project,
			platform: platform
		});

	} else if (action === 'pull' && has_project && has_library) {

		_bootup({
			action:   'pull',
			project:  settings.project,
			library:  settings.library,
			platform: platform,
			target:   target
		});

	} else if (action === 'push' && has_project) {

		_bootup({
			action:  'push',
			project: settings.project
		});

	} else {

		console.error('PARAMETERS FAILURE');

		_print_help();

		process.exit(1);

	}

})(_settings);

