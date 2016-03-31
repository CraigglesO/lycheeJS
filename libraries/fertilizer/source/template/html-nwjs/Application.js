
lychee.define('fertilizer.template.html-nwjs.Application').requires([
	'lychee.data.JSON'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, fertilizer, global, attachments) {

	var _JSON      = lychee.data.JSON;
	var _TEMPLATES = {
		config: attachments["config.tpl"],
		core:   null,
		icon:   attachments["icon.png"],
		index:  attachments["index.tpl"]
	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		fertilizer.Template.call(this, data);

		this.__config = lychee.deserialize(lychee.serialize(_TEMPLATES.config));
		this.__core   = lychee.deserialize(lychee.serialize(_TEMPLATES.core));
		this.__icon   = lychee.deserialize(lychee.serialize(_TEMPLATES.icon));
		this.__index  = lychee.deserialize(lychee.serialize(_TEMPLATES.index));



		/*
		 * INITIALIZATION
		 */

		this.bind('configure', function(oncomplete) {

			console.log('fertilizer: CONFIGURE');

			var that    = this;
			var load    = 4;
			var config  = this.stash.read('./package.json');
			var core    = this.stash.read('/libraries/lychee/build/html-nwjs/core.js');
console.log(core);
			var icon    = this.stash.read('./icon.png');
			var index   = this.stash.read('./index.html');

			if (config !== null) {

				config.onload = function(result) {

					if (result === true) {
						that.__config = this;
					}

					if ((--load) === 0) {
						oncomplete(true);
					}

				};

				config.load();

			}

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

			if (index !== null) {

				index.onload = function(result) {

					if (result === true) {

						this.buffer = this.buffer.replace('/libraries/lychee/build/html/core.js', './core.js');


						var i1 = this.buffer.indexOf('<script>');
						var i2 = this.buffer.indexOf('</script>', i1);
						var i3 = _TEMPLATES.index.buffer.indexOf('<script>');
						var i4 = _TEMPLATES.index.buffer.indexOf('</script>', i3);

						if (i1 !== -1 && i2 !== -1 && i3 !== -1 && i4 !== -1) {
							var inject  = _TEMPLATES.index.buffer.substr(i3, i4 - i3 + 9);
							this.buffer = this.buffer.substr(0, i1) + inject + this.buffer.substr(i2 + 9);
						}


						that.__index = this;

					}


					if ((--load) === 0) {
						oncomplete(true);
					}

				};

				index.load();

			}


			if (config === null && core === null && icon === null && index === null) {
				oncomplete(false);
			}

		}, this);

		this.bind('build', function(oncomplete) {

			var env   = this.environment;
			var stash = this.stash;


			if (env !== null && stash !== null) {

				console.log('fertilizer: BUILD ' + env.id);

				var sandbox = this.sandbox;
				var config  = this.__config;
				var core    = this.__core;
				var icon    = this.__icon;
				var index   = this.__index;


				config.url = sandbox + '/package.json';
				core.url   = sandbox + '/core.js';
				icon.url   = sandbox + '/icon.png';
				index.url  = sandbox + '/index.html';


				config.buffer = config.buffer.replaceObject({
					debug:   env.debug,
					id:      env.id,
					version: lychee.VERSION
				});

				index.buffer = index.buffer.replaceObject({
					blob:    env.serialize(),
					id:      env.id,
					profile: this.profile
				});


				stash.write(config);
				stash.write(core);
				stash.write(icon);
				stash.write(index);


				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

		this.bind('package', function(oncomplete) {

console.log('WOOP WOOP');
oncomplete(true);
return;

			var runtime_fs = new fertilizer.data.Filesystem('/bin/runtime/html-nwjs');
			var runtime_sh = new fertilizer.data.Shell('/bin/runtime/html-nwjs');
			var project_fs = this.filesystem;
			var project_id = this.environment.id.split('/').pop();

			if (project_fs !== null) {

				console.log('fertilizer: PACKAGE ' + project_fs.root + ' ' + project_id);

				if (runtime_fs.info('/package.sh') !== null) {

					var result = runtime_sh.exec('/package.sh ' + project_fs.root + ' ' + project_id);
					if (result === true) {

						oncomplete(true);

					} else {

						runtime_sh.trace();
						oncomplete(false);

					}

				} else {

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
			data['constructor'] = 'fertilizer.template.html-nwjs.Application';


			return data;

		}

	};


	return Class;

});

