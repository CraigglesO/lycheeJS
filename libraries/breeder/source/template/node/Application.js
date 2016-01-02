
lychee.define('breeder.template.node.Application').requires([
	'lychee.data.JSON'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, breeder, global, attachments) {

	var _JSON = lychee.data.JSON;
	var _LIB  = new fertilizer.data.Filesystem('/');
	var _TPL  = new fertilizer.data.Filesystem('/libraries/breeder/asset/template/node');



	/*
	 * HELPERS
	 */

	var _inject_template = function(template, id, path) {

		var index0 = -1;
		var index1 = -1;
		var code   = template.toString().split('\n');


		code.forEach(function(line, index) {

			if (line.trim().substr(0, 28) === 'require(_root + \'/libraries/') {
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

			if (line.trim() === 'lychee.inject(lychee.ENVIRONMENTS[\'' + id + '\']);') {
				index1 = -1;
			}

		});

		if (index1 !== -1) {
			code.splice(index1 + 1, 0, '\tlychee.inject(lychee.ENVIRONMENTS[\'' + id + '\']);');
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

		this.bind('init', function(oncomplete) {

			var fs = this.filesystem;
			if (fs !== null) {

				fs.setMode(fertilizer.data.Filesystem.MODE['default']);

				_LIB.copy(fs, '/libraries/lychee/build/node/core.js');
				_LIB.copy(fs, '/libraries/lychee/build/node/dist/index.js');

				_TPL.copy(fs, '/lychee.pkg');
				_TPL.copy(fs, '/harvester.js');
				_TPL.copy(fs, '/harvester.sh');

				_TPL.copy(fs, '/source/net/remote/Ping.js');
				_TPL.copy(fs, '/source/net/Server.js');

				fs.setMode(fertilizer.data.Filesystem.MODE['sandbox']);


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

		this.bind('pull', function(oncomplete) {

			var build      = this.settings.platform + '/' + this.settings.target;
			var identifier = this.settings.library.split('/').pop();
			var env_id     = '/libraries/' + identifier + '/' + this.settings.target;

			var path = '/libraries/' + identifier + '/build/' + build + '/index.js';
			var lib  = new fertilizer.data.Filesystem(this.settings.library);
			var fs   = this.filesystem;

			if (fs !== null) {

				fs.setMode(fertilizer.data.Filesystem.MODE['default']);

				var data = lib.read('/build/' + build + '/index.js');
				if (data !== null) {
					fs.write(path, data);
				}


				var main = fs.read('/harvester.js');
				if (main !== null) {
					main = _inject_template(main, env_id, path);
					fs.write('/harvester.js', main);
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

