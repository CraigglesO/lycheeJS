
lychee.define('breeder.Template').requires([
	'lychee.Stash',
	'lychee.data.JSON'
]).includes([
	'lychee.event.Flow'
]).exports(function(lychee, breeder, global, attachments) {

	var _JSON  = lychee.data.JSON;
	var _ASSET = '/libraries/breeder/asset';
	var _STASH = new lychee.Stash({
		type: lychee.Stash.TYPE.persistent
	});



	/*
	 * HELPERS
	 */

	var _inject = function(platform, path) {

		var tmp   = path.split('/');
		var tmp_s = '';
		var tmp_c = '';
		var tmp_i = '';

		var code  = ('' + this).toString().split('\n');
		var id    = tmp.slice(0, 3).join('/') + '/' + tmp.slice(5, 6).join('/');
		var found = { include: false, inject: false };
		var index = { include: -1,    inject: -1    };


		if (platform === 'html') {
			tmp_s = '\t<script src="/libraries/';
			tmp_c = '\t<script src="' + path + '"></script>';
			tmp_i = '\t\tlychee.inject(lychee.ENVIRONMENTS[\'' + id + '\']);';
		} else if (platform === 'node') {
			tmp_s = 'require(_root + \'/libraries/';
			tmp_c = 'require(_root + \'' + path + '\');';
			tmp_i = '\tlychee.inject(lychee.ENVIRONMENTS[\'' + id + '\']);';
		}


		code.forEach(function(line, i) {

			var str = line.trim();
			var cmp = tmp_s.trim();
			if (str.substr(0, cmp.length) === cmp) {
				index.include = i;
			}

			if (str === tmp_c.trim()) {
				found.include = true;
			}

		});

		if (found.include === false && index.include >= 0) {
			code.splice(index.include + 1, 0, tmp_c);
		}


		code.forEach(function(line, i) {

			var str = line.trim();
			if (str.substr(0, 14) === 'lychee.inject(') {
				index.inject = i;
			} else if (str.substr(0, 15) === 'lychee.envinit(' && index.inject === -1) {
				index.inject = i - 1;
			} else if (str.substr(0, 15) === 'lychee.pkginit(' && index.inject === -1) {
				index.inject = i - 1;
			}

			if (str === tmp_i.trim()) {
				found.inject = true;
			}

		});

		if (found.inject === false && index.inject >= 0) {
			code.splice(index.inject + 1, 0, tmp_i);
		}


		return code.join('\n');

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.sandbox = '';
		this.stash   = new lychee.Stash({
			type: lychee.Stash.TYPE.persistent
		});


		this.setSandbox(settings.sandbox);


		lychee.event.Flow.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('init', function(oncomplete) {

			var sandbox = this.sandbox;
			var stash   = this.stash;

			if (sandbox !== '' && stash !== null) {

				_STASH.bind('batch', function(type, assets) {

					var pkg  = assets.find(function(asset) {
						return asset.url === _ASSET + '/lychee.pkg';
					}) || null;
					var urls = assets.map(function(asset) {
						return sandbox + asset.url.substr(_ASSET.length);
					});


					if (pkg !== null) {

						var tmp = JSON.stringify(pkg.buffer, null, '\t');

						tmp = tmp.replaceObject({
							id: sandbox
						});

						pkg.buffer = JSON.parse(tmp);

					}


					stash.bind('batch', function(action, woop) {

						if (action === 'write') {
							oncomplete(true);
						}

					}, this, true);

					stash.batch('write', urls, assets);

				}, this, true);

				_STASH.batch('read', [

					_ASSET + '/harvester.js',
					_ASSET + '/icon.png',
					_ASSET + '/index.html',
					_ASSET + '/lychee.pkg',

					_ASSET + '/source/Main.js',
					_ASSET + '/source/net/Client.js',
					_ASSET + '/source/net/Server.js',
					_ASSET + '/source/net/client/Ping.js',
					_ASSET + '/source/net/remote/Ping.js',
					_ASSET + '/source/state/Welcome.js',
					_ASSET + '/source/state/Welcome.json'

				]);

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


				tmp = fs.read('/index.html');
				_LIB.dir(lib + '/build/html').forEach(function(target) {
					copy('html', target);
				});

				if (tmp !== null) {
					fs.write('/index.html', tmp);
				}

				_LIB.dir(lib + '/build/html-nwjs').forEach(function(target) {
					copy('html-nwjs', target);
				});

				_LIB.dir(lib + '/build/html-webview').forEach(function(target) {
					copy('html-webview', target);
				});


				tmp = fs.read('/harvester.js');
				_LIB.dir(lib + '/build/node').forEach(function(target) {
					copy('node', target);
				});

				if (tmp !== null) {
					fs.write('/harvester.js', tmp);
				}

				_LIB.dir(lib + '/build/node-sdl').forEach(function(target) {
					copy('node-sdl', target);
				});


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var stash = lychee.deserialize(blob.stash);
			if (stash !== null) {
				this.stash = stash;
			}

		},

		serialize: function() {

			var data = lychee.event.Flow.prototype.serialize.call(this);
			data['constructor'] = 'breeder.Template';


			var settings = data['arguments'][0] || {};
			var blob     = data['blob'] || {};


			if (this.sandbox !== '') settings.sandbox = this.sandbox;


			if (this.stash !== null) blob.stash = lychee.serialize(this.stash);


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setSandbox: function(sandbox) {

			sandbox = typeof sandbox === 'string' ? sandbox : null;


			if (sandbox !== null) {

				this.sandbox = sandbox;


				return true;

			}


			return false;

		}

	};


	return Class;

});

