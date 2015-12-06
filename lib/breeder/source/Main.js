
lychee.define('breeder.Main').requires([
	'lychee.Input',
	'lychee.data.JSON',
	'breeder.template.html.Application',
	'breeder.template.node.Application'
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
		project:  null

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

			var action     = this.settings.action   || null;
			var platform   = this.settings.platform || null;
			var project    = this.settings.project  || null;
			var identifier = this.settings.platform + '/' + this.settings.target;


			if (typeof breeder.template[platform] === 'object') {

				var construct = breeder.template[platform]['Application'] || null;
				if (construct !== null) {

					var template = new construct({
						filesystem: new fertilizer.data.Filesystem(project),
						shell:      new fertilizer.data.Shell(project),
						settings:   this.settings
					});

					template.then(action);

					template.bind('complete', function() {

						if (lychee.debug === true) {
							console.info('breeder: SUCCESS ("' + project + ' | ' + identifier + '")');
						}

						this.destroy();

					}, this);

					template.bind('error', function(event) {

						if (lychee.debug === true) {
							console.error('breeder: FAILURE ("' + project + ' | ' + identifier + '") at "' + event + '" event');
						}

						this.destroy();

					}, this);


					template.init();

					return true;

				} else {

					if (lychee.debug === true) {
						console.error('breeder: FAILURE ("' + project + ' | ' + identifier + '") at "init" event');
					}

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

