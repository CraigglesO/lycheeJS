
lychee.define('breeder.template.html.Application').requires([
	'lychee.data.JSON'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, breeder, global, attachments) {

	var _JSON = lychee.data.JSON;
	var _LIB  = new fertilizer.data.Filesystem('/');
	var _TPL  = new fertilizer.data.Filesystem('/lib/breeder/asset/html');



	/*
	 * HELPERS
	 */

	var _inject_template = function(template, identifier, path) {

		var index0 = -1;
		var index1 = -1;
		var code   = template.toString().split('\n');


		code.forEach(function(line, index) {

			if (line.trim().substr(0, 18) === '<script src="/lib/') {
				index0 = index;
			}

		});

		code.forEach(function(line, index) {

			if (line.trim() === '<script src="' + path + '"></script>') {
				index0 = -1;
			}

		});

		if (index0 !== -1) {
			code.splice(index0 + 1, 0, '\t<script src="' + path + '"></script>');
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

				_LIB.copy(fs, '/lib/lychee/build/html/core.js');
				_LIB.copy(fs, '/lib/lychee/build/html/dist/index.js');

				_TPL.copy(fs, '/favicon.ico');
				_TPL.copy(fs, '/lychee.pkg');

				_TPL.copy(fs, '/design/highlight.css');
				_TPL.copy(fs, '/design/highlight.js');
				_TPL.copy(fs, '/design/icon.eot');
				_TPL.copy(fs, '/design/icon.svg');
				_TPL.copy(fs, '/design/icon.ttf');
				_TPL.copy(fs, '/design/icon.woff');
				_TPL.copy(fs, '/design/index.css');
				_TPL.copy(fs, '/design/index.js');
				_TPL.copy(fs, '/design/museo-sans-300.eot');
				_TPL.copy(fs, '/design/museo-sans-300.svg');
				_TPL.copy(fs, '/design/museo-sans-300.ttf');
				_TPL.copy(fs, '/design/museo-sans-300.woff');
				_TPL.copy(fs, '/design/museo-sans-300.woff2');
				_TPL.copy(fs, '/design/museo-sans-500.eot');
				_TPL.copy(fs, '/design/museo-sans-500.svg');
				_TPL.copy(fs, '/design/museo-sans-500.ttf');
				_TPL.copy(fs, '/design/museo-sans-500.woff');
				_TPL.copy(fs, '/design/museo-sans-500.woff2');

				_TPL.copy(fs, '/source/Main.js');
				_TPL.copy(fs, '/source/index.html');
				_TPL.copy(fs, '/source/net/Client.js');
				_TPL.copy(fs, '/source/net/client/Ping.js');
				_TPL.copy(fs, '/source/state/Welcome.js');
				_TPL.copy(fs, '/source/state/Settings.js');

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


				var main = fs.read('/source/index.html');
				if (main !== null) {
					main = _inject_template(main, identifier, path);
					fs.write('/source/index.html', main);
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

