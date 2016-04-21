
lychee.define('strainer.Template').requires([
	'lychee.Stash',
	'lychee.data.JSON'
]).includes([
	'lychee.event.Flow'
]).exports(function(lychee, global, attachments) {

	var _Flow  = lychee.import('lychee.event.Flow');
	var _Stash = lychee.import('lychee.Stash');
	var _JSON  = lychee.import('lychee.data.JSON');
	var _STASH = new _Stash({
		type: _Stash.TYPE.persistent
	});



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.sandbox  = '';
		this.settings = {};
		this.stash    = new _Stash({
			type: _Stash.TYPE.persistent
		});


		this.setSandbox(settings.sandbox);
		this.setSettings(settings.settings);


		_Flow.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('init', function(oncomplete) {

			var sandbox = this.sandbox;
			var stash   = this.stash;

			if (sandbox !== '' && stash !== null) {

				console.log('strainer: INIT');

			} else {

				oncomplete(false);

			}

		}, this);


		this.bind('stash', function(oncomplete) {

			var library = this.settings.library;
			var stash   = this.stash;


			if (library !== null && stash !== null) {

				console.log('strainer: STASH ' + library);


				var sandbox = this.sandbox;

			} else {

				oncomplete(false);

			}

		});

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

			var data = _Flow.prototype.serialize.call(this);
			data['constructor'] = 'strainer.Template';


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

		},

		setSettings: function(settings) {

			settings = settings instanceof Object ? settings : null;


			if (settings !== null) {

				this.settings = settings;

				return true;

			}


			return false;

		}

	};


	return Class;

});

