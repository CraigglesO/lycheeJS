
lychee.define('breeder.Main').requires([
	'lychee.Input',
	'lychee.Stash',
	'lychee.data.JSON',
	'breeder.Template'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, breeder, global, attachments) {

	var _lychee = lychee;
	var _JSON   = lychee.data.JSON;



	/*
	 * FEATURE DETECTION
	 */

	var _defaults = {

		action:  null,
		project: null,
		library: null

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

		this.bind('load', function() {

			var action  = this.settings.action  || null;
			var project = this.settings.project || null;

			if (action !== null && project !== null) {

				lychee.ROOT.project                           = lychee.ROOT.lychee + project;
				lychee.environment.global.lychee.ROOT.project = lychee.ROOT.lychee + project;


				this.trigger('init', [ project, action ]);

			} else {

				console.error('breeder: FAILURE ("' + project + '") at "load" event');


				this.destroy(1);

			}

		}, this, true);

		this.bind('init', function(project, action) {

			var template = new breeder.Template({
				sandbox: project
			});


			template.then(action);

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


			template.init();

			return true;

		}, this, true);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'breeder.Main';


			var settings = lychee.extendunlink({}, this.settings);
			var blob     = data['blob'] || {};


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * MAIN API
		 */

		init: function() {

			this.trigger('load');

		},

		destroy: function(code) {

			code = typeof code === 'number' ? code : 0;


			this.trigger('destroy', [ code ]);

		}

	};


	return Class;

});

