
lychee.define('fertilizer.template.html-webview.Application').requires([
	'fertilizer.data.Shell'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, global, attachments) {

	var _Template  = lychee.import('fertilizer.Template');
	var _Shell     = lychee.import('fertilizer.data.Shell');
	var _TEMPLATES = {
		core:  null,
		icon:  attachments["icon.png"],
		index: attachments["index.tpl"]
	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		_Template.call(this, data);


		this.__core  = lychee.deserialize(lychee.serialize(_TEMPLATES.core));
		this.__icon  = lychee.deserialize(lychee.serialize(_TEMPLATES.icon));
		this.__index = lychee.deserialize(lychee.serialize(_TEMPLATES.index));



		/*
		 * INITIALIZATION
		 */

		this.bind('configure', function(oncomplete) {

			console.log('fertilizer: CONFIGURE');

			var that = this;
			var load = 2;
			var core = this.stash.read('/libraries/lychee/build/html-webview/core.js');
			var icon = this.stash.read('./icon.png');

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

			if (icon !== null) {

				icon.onload = function(result) {

					if (result === true) {
						that.__icon = this;
					}

					if ((--load) === 0) {
						oncomplete(true);
					}

				};

				icon.load();

			}


			if (core === null && icon === null) {
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
				var icon    = this.__icon;
				var index   = this.__index;


				index.buffer = index.buffer.replaceObject({
					blob:    env.serialize(),
					id:      env.id,
					profile: this.profile
				});


				stash.write(sandbox + '/core.js',    core);
				stash.write(sandbox + '/icon.png',   icon);
				stash.write(sandbox + '/index.html', index);


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

		this.bind('package', function(oncomplete) {

			var name    = this.environment.id.split('/')[2];
			var shell   = new _Shell('/bin/runtime/html-webview');
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

			var data = _Template.prototype.serialize.call(this);
			data['constructor'] = 'fertilizer.template.html-webview.Application';


			return data;

		}

	};


	return Class;

});

