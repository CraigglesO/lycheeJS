
lychee.define('breeder.template.node.Application').requires([
	'lychee.data.JSON'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, breeder, global, attachments) {

	var _JSON = lychee.data.JSON;
	var _LIB  = new fertilizer.data.Filesystem('/');
	var _TPL  = new fertilizer.data.Filesystem('/lib/breeder/asset/node');



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

				_TPL.copy(fs, '/source/net/client/Ping.js');
				_TPL.copy(fs, '/source/net/remote/Ping.js');
				_TPL.copy(fs, '/source/net/Client.js');
				_TPL.copy(fs, '/source/net/Server.js');


				fs.setMode(fertilizer.data.Filesystem.MODE['sandbox']);


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

		this.bind('inject', function(oncomplete) {

			var build      = this.settings.platform + '/' + this.settings.target;
			var identifier = this.settings.library.split('/').pop();

			var lib = new fertilizer.data.Filesystem(this.settings.library);
			var fs  = this.filesystem;

			if (fs !== null) {

				fs.setMode(fertilizer.data.Filesystem.MODE['default']);

				var data = lib.read('/build/' + build + '/index.js');
				if (data !== null) {
					fs.write('/lib/' + identifier + '/build/' + build + '/index.js', data);
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

