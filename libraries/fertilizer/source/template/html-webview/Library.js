
lychee.define('fertilizer.template.html-webview.Library').requires([
	'lychee.data.JSON'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, fertilizer, global, attachments) {

	var _JSON     = lychee.data.JSON;
	var _TEMPLATE = attachments["tpl"];



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		fertilizer.Template.call(this, data);


		this.__index = lychee.deserialize(lychee.serialize(_TEMPLATE));



		/*
		 * INITIALIZATION
		 */

		this.bind('configure', function(oncomplete) {
			oncomplete(true);
		}, this);

		this.bind('build', function(oncomplete) {

			var env   = this.environment;
			var stash = this.stash;

			if (env !== null && stash !== null) {

				console.log('fertilizer: BUILD ' + env.id);


				var sandbox = this.sandbox;
				var index   = this.__index;


				index.buffer = index.buffer.replaceObject({
					blob: env.serialize(),
					id:   env.id
				});


				stash.write(sandbox + '/index.js', index);


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

		this.bind('package', function(oncomplete) {
			oncomplete(true);
		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = fertilizer.Template.prototype.serialize.call(this);
			data['constructor'] = 'fertilizer.template.html-webview.Library';


			return data;

		}

	};


	return Class;

});

