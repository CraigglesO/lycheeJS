
lychee.define('app.state.Profile').includes([
	'lychee.app.State'
]).requires([
	'lychee.ui.Blueprint',
	'lychee.ui.Element',
	'lychee.ui.Input',
	'lychee.ui.Select',
	'lychee.ui.Table',
	'lychee.ui.Helper',
//	'app.ui.Profile'
]).exports(function(lychee, app, global, attachments) {

	var _blob   = attachments["json"].buffer;
	var _helper = new lychee.ui.Helper();



	/*
	 * HELPERS
	 */

	var _on_relayout = function() {

		var viewport = this.viewport;
		if (viewport !== null) {

			var entity = null;
			var width  = viewport.width;
			var height = viewport.height;
			var menu   = this.queryLayer('ui', 'menu');


			entity = this.getLayer('ui');
			entity.width      = width;
			entity.height     = height;


			for (var e = 0, el = entity.entities.length; e < el; e++) {

				var blueprint = entity.entities[e];
				if (blueprint !== menu) {

					blueprint.width      = width - menu.width;
					blueprint.height     = height;
					blueprint.position.x = menu.width / 2;
					blueprint.trigger('relayout');

				}

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		this.__interval = null;


		lychee.app.State.call(this, main);

		this.deserialize(_blob);

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		deserialize: function(blob) {

			lychee.app.State.prototype.deserialize.call(this, blob);


			var state = this.main.getState('welcome');
			if (state !== null) {

				var menu = state.queryLayer('ui', 'menu');
				if (menu !== null) {

					this.getLayer('ui').setEntity('menu', menu);

					menu.bind('relayout', function() {
						_on_relayout.call(this);
					}, this);

				}

			}


			this.queryLayer('ui', 'profile > select').bind('change', function(value) {

				if (value === 'save') {

					var data = {
						port:  1337,
						hosts: {}
					};


					var element = this.queryLayer('ui', 'profile > modify');
					if (element !== null) {

						var hosts = element.__content[0].value;
						if (hosts.length > 0) {

							hosts.forEach(function(host) {
								data[object.host] = object.project === '*' ? null : object.project;
							});

						}

					}

console.log('SAVING PROFILE', data);


/*
					var profile = lychee.deserialize({
						constructor: 'Config',
						arguments:   [ 'http://localhost:4848/api/Profile?timestamp=' + Date.now() ],
						blob:        {
							buffer: 'data:application/json;base64,' + new Buffer(JSON.stringify(data), 'utf8').toString('base64')
						}
					});

					if (profile !== null) {

						_helper.setValue('profile=' + identifier + '&data=' + JSON.encode(profile.buffer));
						_helper.trigger('touch');

					}
*/

				}

			}, this);


			var viewport = this.viewport;
			if (viewport !== null) {

				viewport.bind('reshape', function(orientation, rotation, width, height) {
					_on_relayout.call(this);
				}, this);

			}

		},

		serialize: function() {

			var data = lychee.app.State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Profile';


			if (data.blob !== null) {

				if (data.blob.layers instanceof Object) {

					data.blob.layers['ui'].blob.entities = data.blob.layers['ui'].blob.entities.filter(function(blob) {
						return blob.constructor !== 'lychee.ui.Menu';
					});

				}

			}


			return data;

		},

		enter: function(oncomplete, data) {

			var profile = this.main.profile;
			if (profile === null || profile.buffer === null) {

				this.queryLayer('ui', 'profile').setVisible(false);

			} else {

				this.queryLayer('ui', 'profile').setVisible(true);

			}


			lychee.app.State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete, data) {

			lychee.app.State.prototype.leave.call(this, oncomplete);

		}

	};


	return Class;

});

