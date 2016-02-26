
lychee.define('lychee.app.state.Menu').requires([
	'lychee.effect.Alpha',
	'lychee.effect.Position',
	'lychee.effect.Visible',
	'lychee.ui.Background',
	'lychee.ui.Blueprint',
	'lychee.ui.Element',
	'lychee.ui.Emblem',
	'lychee.ui.Label',
	'lychee.ui.Layer',
	'lychee.ui.Switch',
	'lychee.ui.Text',
	'lychee.ui.Menu',
	'lychee.ui.element.Input',
	'lychee.ui.element.Jukebox',
	'lychee.ui.element.Network',
	'lychee.ui.element.Stash',
	'lychee.ui.element.Storage',
	'lychee.ui.element.Viewport'
]).includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	var _blob = attachments["json"].buffer;



	/*
	 * HELPERS
	 */

	var _on_change = function(active) {

		var fade_offset = -3/2 * this.getLayer('ui').height;
		var layers      = this.getLayer('ui').entities.filter(function(entity) {
			return lychee.interfaceof(lychee.ui.Menu, entity) === false;
		});


		var entity = this.queryLayer('ui', active);
		if (entity !== null) {

			layers.forEach(function(layer) {

				if (entity === layer) {

					layer.setVisible(true);
					layer.setPosition({
						y: fade_offset
					});

					layer.addEffect(new lychee.effect.Position({
						type:     lychee.effect.Position.TYPE.easeout,
						duration: 300,
						position: {
							y: 0
						}
					}));

				} else {

					layer.setPosition({
						y: 0
					});

					layer.addEffect(new lychee.effect.Position({
						type:     lychee.effect.Position.TYPE.easeout,
						duration: 300,
						position: {
							y: fade_offset
						}
					}));

					layer.addEffect(new lychee.effect.Visible({
						delay:   300,
						visible: false
					}));

				}

			});

		}

	};

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

			entity = this.queryLayer('ui', 'welcome');
			entity.width      = width - menu.width;
			entity.height     = height;
			entity.position.x = menu.width / 2;

			entity = this.queryLayer('ui', 'settings');
			entity.width      = width - menu.width;
			entity.height     = height;
			entity.position.x = menu.width / 2;

			entity = this.queryLayer('ui', 'about');
			entity.width      = width - menu.width;
			entity.height     = height;
			entity.position.x = menu.width / 2;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.app.State.call(this, main);


		this.deserialize(_blob);



		/*
		 * INITIALIZATION
		 */

		var input = this.input;
		if (input !== null) {

			input.bind('escape', function(delta) {

				var entity = this.queryLayer('ui', 'menu');
				if (entity !== null) {

					if (entity.state === 'active') {

						entity.trigger('blur');

						if (this.__focus !== null) {
							this.__focus.trigger('blur');
						}

						this.__focus = this.queryLayer('ui', entity.value.toLowerCase());
						this.__focus.trigger('focus');

					} else {

						entity.trigger('focus');

						this.__focus = entity.getEntity('select');
						this.__focus.trigger('focus');

					}

				}

			}, this);

		}

		var viewport = this.viewport;
		if (viewport !== null) {

			viewport.relay('reshape', this.queryLayer('bg', 'background'));
			viewport.relay('reshape', this.queryLayer('bg', 'emblem'));
			viewport.relay('reshape', this.queryLayer('ui', 'menu'));


			this.queryLayer('ui', 'menu').bind('relayout', function() {
				_on_relayout.call(this);
			}, this);

			viewport.bind('reshape', function(orientation, rotation, width, height) {
				_on_relayout.call(this);
			}, this);

		}

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		serialize: function() {

			var data = lychee.app.State.prototype.serialize.call(this);
			data['constructor'] = 'lychee.app.state.Menu';


			return data;

		},

		deserialize: function(blob) {

			lychee.app.State.prototype.deserialize.call(this, blob);


			this.queryLayer('ui', 'menu').bind('change', function(value) {
				_on_change.call(this, value.toLowerCase());
			}, this);

			this.queryLayer('ui', 'welcome > dialog').bind('change', function(value) {
				_on_change.call(this, value);
			}, this);

		},

		update: function(clock, delta) {

			lychee.app.State.prototype.update.call(this, clock, delta);

		},

		enter: function(data) {

			lychee.app.State.prototype.enter.call(this);


			var menu = this.queryLayer('ui', 'menu');
			if (menu !== null) {
				menu.trigger('change', [ 'Welcome' ]);
			}

		}

	};


	return Class;

});
