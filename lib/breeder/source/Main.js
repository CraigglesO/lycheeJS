
lychee.define('breeder.Main').requires([
	'lychee.Input',
	'lychee.data.JSON',
	'breeder.template.html.Application'
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

		project:    null,
		identifier: null,
		settings:   null

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

			var project  = this.settings.project  || null;
			var action   = this.settings.action   || null;
			var platform = this.settings.platform || null;


			if (typeof breeder.template[platform] === 'object') {

				var construct = breeder.template[platform]['Application'] || null;
				if (construct !== null) {

					var template = new construct({
						filesystem: new fertilizer.data.Filesystem(project),
						shell:      new fertilizer.data.Shell(project)
					});

					template.then(action);

					template.bind('complete', function() {

						if (lychee.debug === true) {
							console.info('breeder: SUCCESS ("' + project + ' / ' + platform + '")');
						}

						this.destroy();

					}, this);

					template.bind('error', function(event) {

						if (lychee.debug === true) {
							console.error('breeder: FAILURE ("' + project + ' / ' + platform + '") at "' + event + '" event');
						}

						this.destroy();

					}, this);


					template.init();

					return true;

				}

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

