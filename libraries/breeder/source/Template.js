
lychee.define('breeder.Template').requires([
	'lychee.data.JSON'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, breeder, global, attachments) {

	var _JSON = lychee.data.JSON;
	var _LIB  = new fertilizer.data.Filesystem('/');
	var _TPL  = new fertilizer.data.Filesystem('/libraries/breeder/asset');



	/*
	 * HELPERS
	 */

	var _inject = function(platform, path) {

		var tmp   = path.split('/');
		var tmp_s = '';
		var tmp_c = '';

		var code  = ('' + this).toString().split('\n');
		var id    = tmp.slice(0, 3).join('/') + '/' + tmp.slice(5, 6).join('/');
		var found = { include: false, inject: false };
		var index = { include: -1,    inject: -1    };


		if (platform === 'html') {
			tmp_s = '\t<script src="/libraries/';
			tmp_c = '\t<script src="%path%"></script>';
		} else if (platform === 'node') {
			tmp_s = 'require(_root + \'/libraries/';
			tmp_c = 'require(_root + \'%path%\');';
		}


		code.forEach(function(line, i) {

			var str = line.trim();
			if (str.substr(0, tmp_s.length) === tmp_s) {
				index.include = i;
			}

			if (str === tmp_c.trim().replace('%path%', path)) {
				found.include = true;
			}

		});

		if (found.include === false) {
			code.splice(index.include + 1, 0, tmp_c.replace('%path%', path));
		}


		code.forEach(function(line, i) {

			var str = line.trim();
			if (str.substr(0, 14) === 'lychee.inject(') {
				index.inject = i;
			} else if (str.substr(0, 15) === 'lychee.envinit(' && index.inject === -1) {
				index.inject = i;
			} else if (str.substr(0, 15) === 'lychee.pkginit(' && index.inject === -1) {
				index.inject = i;
			}

			if (str === 'lychee.inject(lychee.ENVIRONMENTS[\'' + id + '\']);') {
				found.inject = true;
			}

		});

		if (found.inject === false) {
			code.splice(index.inject + 1, 0, '\tlychee.inject(lychee.ENVIRONMENTS[\'' + id + '\']);');
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

				_TPL.copy(fs, '/lychee.pkg');
				_TPL.copy(fs, '/harvester.js');
				fs.chmod('/harvester.js', '775');


				_LIB.copy(fs, '/libraries/lychee/build/node/core.js');
				_LIB.copy(fs, '/libraries/lychee/build/node/dist/index.js');

				_LIB.copy(fs, '/libraries/lychee/build/html/core.js');
				_LIB.copy(fs, '/libraries/lychee/build/html/dist/index.js');

				_TPL.copy(fs, '/source/Main.js');
				_TPL.copy(fs, '/source/net/remote/Ping.js');
				_TPL.copy(fs, '/source/net/Server.js');
				_TPL.copy(fs, '/source/net/Client.js');
				_TPL.copy(fs, '/source/net/client/Ping.js');
				_TPL.copy(fs, '/source/state/Menu.js');
				_TPL.copy(fs, '/source/state/Menu.json');

				_TPL.copy(fs, '/index.html');
				_TPL.copy(fs, '/favicon.ico');


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

		this.bind('pull', function(oncomplete) {

			var fs  = this.filesystem;
			var lib = this.settings.library;
			if (fs !== null && lib !== null) {

				var tmp  = null;
				var copy = function(platform, target) {

					var path = lib + '/build/' + platform + '/' + target + '/index.js';
					var info = _LIB.info(path);
					if (info !== null && info.type === 'file') {

						_LIB.copy(fs, path);

						if (tmp !== null) {
							tmp = _inject.call(tmp, platform, path);
						}

					}

				};


				tmp = fs.read('/harvester.js');
				_LIB.dir(lib + '/build/node').forEach(function(target) {
					copy('node', target);
				});

				if (tmp !== null) {
					fs.write('/harvester.js', tmp);
				}


				tmp = fs.read('/index.html');
				_LIB.dir(lib + '/build/html').forEach(function(target) {
					copy('html', target);
				});

				if (tmp !== null) {
					fs.write('/index.html', tmp);
				}


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});

