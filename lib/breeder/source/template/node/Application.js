
lychee.define('breeder.template.node.Application').requires([
	'lychee.data.JSON'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, breeder, global, attachments) {

	var _JSON = lychee.data.JSON;
	var _LIB  = new fertilizer.data.Filesystem('/');
	var _TPL  = new fertilizer.data.Filesystem('/lib/breeder/asset/template/node');



	/*
	 * HELPERS
	 */

	var _inject_template = function(template, identifier, path) {

		var index0 = -1;
		var index1 = -1;
		var code   = template.toString().split('\n');


		code.forEach(function(line, index) {

			if (line.trim().substr(0, 22) === 'require(_root + \'/lib/') {
				index0 = index;
			}

		});

		code.forEach(function(line, index) {

			if (line.trim() === 'require(_root + \'' + path + '\');') {
				index0 = -1;
			}

		});

		if (index0 !== -1) {
			code.splice(index0 + 1, 0, 'require(_root + \'' + path + '\');');
		}


		code.forEach(function(line, index) {

			if (line.trim().substr(0, 33) === 'lychee.inject(lychee.ENVIRONMENTS') {
				index1 = index;
			}

		});

		if (index1 === -1) {

			code.forEach(function(line, index) {

				if (line.trim() === 'lychee.setEnvironment(environment);') {
					index1 = index;
				}

			});

		}

		code.forEach(function(line, index) {

			if (line.trim() === 'lychee.inject(lychee.ENVIRONMENTS[\'' + identifier + '\']);') {
				index1 = -1;
			}

		});

		if (index1 !== -1) {
			code.splice(index1 + 1, 0, '\tlychee.inject(lychee.ENVIRONMENTS[\'' + identifier + '\']);');
		}


		return code.join('\n');

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		fertilizer.Template.call(this, data);



		/*
		 * INITIALIZATION
		 */

		this.bind('configure', function(oncomplete) {

			var fs = this.filesystem;
			if (fs !== null) {

				fs.setMode(fertilizer.data.Filesystem.MODE['default']);

				_LIB.copy(fs, '/lib/lychee/build/node/core.js');
				_LIB.copy(fs, '/lib/lychee/build/node/dist/index.js');

				_TPL.copy(fs, '/lychee.pkg');
				_TPL.copy(fs, '/sorbet.js');
				_TPL.copy(fs, '/sorbet.sh');

				_TPL.copy(fs, '/source/net/remote/Ping.js');
				_TPL.copy(fs, '/source/net/Server.js');

				fs.setMode(fertilizer.data.Filesystem.MODE['sandbox']);


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

		this.bind('install', function(oncomplete) {

			var build      = this.settings.platform + '/' + this.settings.target;
			var identifier = this.settings.library.split('/').pop();

			var path = '/lib/' + identifier + '/build/' + build + '/index.js';
			var lib  = new fertilizer.data.Filesystem(this.settings.library);
			var fs   = this.filesystem;

			if (fs !== null) {

				fs.setMode(fertilizer.data.Filesystem.MODE['default']);

				var data = lib.read('/build/' + build + '/index.js');
				if (data !== null) {
					fs.write(path, data);
				}


				var main = fs.read('/sorbet.js');
				if (main !== null) {
					main = _inject_template(main, identifier, path);
					fs.write('/sorbet.js', main);
				}

				fs.setMode(fertilizer.data.Filesystem.MODE['sandbox']);


				oncomplete(true);

			}


			oncomplete(false);

		}, this);

		this.bind('fertilize', function(oncomplete) {
			oncomplete(true);
		}, this);

	};


	Class.prototype = {

	};


	return Class;

});

