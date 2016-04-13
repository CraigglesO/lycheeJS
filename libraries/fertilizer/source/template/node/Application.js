
lychee.define('fertilizer.template.node.Application').requires([
	'lychee.data.JSON',
	'fertilizer.data.Shell'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, fertilizer, global, attachments) {

	var _JSON      = lychee.data.JSON;
	var _TEMPLATES = {
		core:  null,
		index: attachments["index.tpl"]
	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		fertilizer.Template.call(this, data);


		this.__core  = lychee.deserialize(lychee.serialize(_TEMPLATES.core));
		this.__index = lychee.deserialize(lychee.serialize(_TEMPLATES.index));



		/*
		 * INITIALIZATION
		 */

		this.bind('configure', function(oncomplete) {

			console.log('fertilizer: CONFIGURE');


			var that = this;
			var load = 1;
			var core = this.stash.read('/libraries/lychee/build/node/core.js');

			if (core !== null) {

				core.onload = function(result) {

					if (result === true) {
						that.__core = this;
					}

					if ((--load) === 0) {
						oncomplete(true);
					}

				};

				core.load();

			}


			if (core === null) {
				oncomplete(false);
			}

		}, this);

		this.bind('build', function(oncomplete) {

			var env   = this.environment;
			var stash = this.stash;

			if (env !== null && stash !== null) {

				console.log('fertilizer: BUILD ' + env.id);


				var sandbox = this.sandbox;
				var core    = this.__core;
				var index   = this.__index;


				index.buffer = index.buffer.replaceObject({
					blob:    env.serialize(),
					id:      env.id,
					profile: this.profile
				});


				stash.write(sandbox + '/core.js',  core);
				stash.write(sandbox + '/index.js', index);


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

		this.bind('package', function(oncomplete) {

			var name    = this.environment.id.split('/')[2];
			var shell   = new fertilizer.data.Shell('/bin/runtime/node');
			var sandbox = this.sandbox;

			if (name === 'cultivator') {
				name = this.environment.id.split('/')[3];
			}


			if (sandbox !== '') {

				console.log('fertilizer: PACKAGE ' + sandbox + ' ' + name);


				var result = shell.exec('/package.sh ' + sandbox + ' ' + name);
				if (result === true) {

					oncomplete(true);

				} else {

					shell.trace();
					oncomplete(false);

				}

			} else {

				oncomplete(false);

			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = fertilizer.Template.prototype.serialize.call(this);
			data['constructor'] = 'fertilizer.template.node.Application';


			return data;

		}

	};


	return Class;

});

