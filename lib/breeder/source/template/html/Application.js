
lychee.define('breeder.template.html.Application').requires([
	'lychee.data.JSON'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, breeder, global, attachments) {

	var _JSON = lychee.data.JSON;
	var _LIB  = new fertilizer.data.Filesystem('/');
	var _TPL  = new fertilizer.data.Filesystem('/lib/breeder/asset/html');



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
				_TPL.copy(fs, '/index.html');
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

				_TPL.copy(fs, '/source/index.js');


				fs.setMode(fertilizer.data.Filesystem.MODE['sandbox']);


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

		this.bind('fertilize', function(oncomplete) {
			oncomplete(true);
		}, this);

	};


	Class.prototype = {

	};


	return Class;

});

