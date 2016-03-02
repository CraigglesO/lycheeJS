
lychee.define('breeder.Main').requires([
	'lychee.Input',
	'lychee.data.JSON',
	'breeder.Template'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, breeder, global, attachments) {

	var _lychee = lychee;
	var _path   = require('path');
	var _JSON   = lychee.data.JSON;



	/*
	 * FEATURE DETECTION
	 */

	var _defaults = {

		action:   null,
		platform: null,
		project:  null,
		library:  null

	};



	/*
	 * HELPERS
	 */

	var _breed = function(settings) {

		var project    = settings.project;


		var template   = new breeder.Template({
			filesystem: new fertilizer.data.Filesystem(settings.project),
			shell:      new fertilizer.data.Filesystem(settings.project),
			settings:   settings
		});

		template.bind('complete', function() {

			if (lychee.debug === true) {
				console.info('breeder: SUCCESS ("' + project + '")');
			}

			this.destroy();

		}, this);

		template.bind('error', function(event) {

			if (lychee.debug === true) {
				console.error('breeder: FAILURE ("' + project + '") at "' + event + '" template event');
			}

			this.destroy();

		}, this);


		return template;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(settings) {

		this.settings = lychee.extendunlink({}, _defaults, settings);
		this.defaults = lychee.extendunlink({}, this.settings);


		lychee.event.Emitter.call(this);


		/*
		 * INITIALIZATION
		 */

		var that = this;


		this.bind('init', function() {

			var settings = this.settings;
			var template = _breed.call(this, settings);
			if (template !== null) {

				template.then(settings.action);
				template.init();

				return true;

			}


			if (lychee.debug === true) {
				console.error('breeder: FAILURE ("' + settings.project + '") at "init" event');
			}


			this.destroy();

			return false;

		}, this, true);

	};


	Class.prototype = {

		/*
		 * MAIN API
		 */

		init: function() {

			this.trigger('init', []);

		},

		destroy: function() {

			this.trigger('destroy', []);

		}

	};


	return Class;

});

