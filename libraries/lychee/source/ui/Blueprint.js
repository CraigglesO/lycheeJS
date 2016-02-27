
lychee.define('lychee.ui.Blueprint').requires([
	'lychee.effect.Alpha',
	'lychee.effect.Offset',
	'lychee.effect.Position',
	'lychee.ui.Element'
]).includes([
	'lychee.ui.Layer'
]).exports(function(lychee, global) {

	/*
	 * HELPERS
	 */

	var _on_relayout = function() {

		var visible = this.visible;
		if (visible === true) {

			var x1 = -1/2 * this.width;
			var x2 =  1/2 * this.width;
			var y1 = -1/2 * this.height;
			var y2 =  1/2 * this.height;


			var offset_x    = x1 + 32;
			var offset_y    = y1 + 32;
			var fade_offset = 3/2 * this.height;


			this.__scroll.min   = 0;
			this.__scroll.delta = 0;


			for (var e = 0, el = this.entities.length; e < el; e++) {

				var entity = this.entities[e];
				var pos_x  = offset_x + entity.width  / 2;
				var pos_y  = offset_y + entity.height / 2;

				if (pos_x + entity.width / 2 > x2 - 32) {

					offset_x  = x1 + 32;
					offset_y += entity.height + 32;

					pos_x = offset_x + entity.width  / 2;
					pos_y = offset_y + entity.height / 2;

					offset_x += entity.width + 32;

				} else {

					pos_x = offset_x + entity.width  / 2;
					pos_y = offset_y + entity.height / 2;

					offset_x += entity.width + 32;

				}


				entity.trigger('relayout', []);


				entity.setAlpha(0);
				entity.setOrder(e + 1);
				entity.setPosition({
					x: pos_x,
					y: pos_y - fade_offset
				});


				entity.addEffect(new lychee.effect.Alpha({
					type:     lychee.effect.Alpha.TYPE.easeout,
					delay:    100 * 3,
					duration: 300,
					alpha:    1.0
				}));

				entity.addEffect(new lychee.effect.Position({
					type:     lychee.effect.Position.TYPE.easeout,
					delay:    100 * e,
					duration: 300,
					position: {
						x: pos_x,
						y: pos_y
					}
				}));


				this.__scroll.min   = Math.min(this.__scroll.min,   -1 * (y1 + pos_y + entity.height / 2 + 32));
				this.__scroll.delta = Math.max(this.__scroll.delta, entity.height + 32);

			}

		}

	};

	var _on_tab = function(name) {

		if (this.__focus.element === null) {
			this.__focus.element = this.entities[0] || null;
		}


		var focus = this.__focus;
		if (focus.element !== null) {

			var entities  = focus.element.entities;
			var triggered = null;


			if (name === 'tab') {

				var e = focus.entity !== null ? focus.entity : 0;

				for (var el = entities.length; e < el; e++) {

					var entity = entities[e];

					if (e === focus.entity) {

						entity.trigger('blur');

					} else if (entity.visible === true) {

						var result = entity.trigger('focus');
						if (result === true && entity.state === 'active') {
							triggered = e;
							break;
						}

					}

				}


				if (triggered === null) {

					var index = this.entities.indexOf(focus.element);
					if (index !== -1) {

						focus.element = this.entities[index + 1] || null;
						focus.entity  = null;

					}

				}

			} else if (name === 'shift-tab') {

				var e = focus.entity !== null ? focus.entity : entities.length - 1;

				for (var el = entities.length; e >= 0; e--) {

					var entity = entities[e];

					if (e === focus.entity) {

						entity.trigger('blur');

					} else if (entity.visible === true) {

						var result = entity.trigger('focus');
						if (result === true && entity.state === 'active') {
							triggered = e;
							break;
						}

					}

				}


				if (triggered === null) {

					var index = this.entities.indexOf(focus.element);
					if (index !== -1) {

						focus.element = this.entities[index - 1] || null;
						focus.entity  = null;

					}

				}

			}



			if (triggered !== null) {
				focus.entity = triggered;
			} else if (focus.element !== null) {
				_on_tab.call(this, name);
			}

		}

	};

	var _on_touch = function(id, position, delta) {

		if (this.visible === false) return null;


		var triggered = null;
		var args      = [ id, {
			x: position.x - this.offset.x,
			y: position.y - this.offset.y
		}, delta ];


		var entity = this.getEntity(null, args[1]);
		if (entity !== null) {

			if (typeof entity.trigger === 'function') {

				args[1].x -= entity.position.x;
				args[1].y -= entity.position.y;

				var result = entity.trigger('touch', args);
				if (result === true) {
					triggered = entity;
				} else if (result !== false) {
					triggered = result;
				}

			}

		} else {

			triggered = this;

		}


		return triggered;

	};

	var _on_swipe = function(id, type, position, delta, swipe) {

		if (this.effects.length === 0) {

			var scroll = this.__scroll;


			if (type === 'start') {

				scroll.start = this.offset.y;

			} else if (type === 'move' || type === 'end') {

				if (scroll.start === null) {
					scroll.start = this.offset.x;
				}


				if (Math.abs(swipe.y) >= 128) {

					var offset_y = scroll.start;

					if (swipe.y > 0) {
						offset_y += scroll.delta;
					} else if (swipe.y < 0) {
						offset_y -= scroll.delta;
					}


					if (offset_y < scroll.min) {
						offset_y = scroll.min;
					} else if (offset_y > 0) {
						offset_y = 0;
					}


					this.addEffect(new lychee.effect.Offset({
						type:     lychee.effect.Offset.TYPE.easeout,
						duration: 300,
						offset:   {
							y: offset_y
						}
					}));


					return false;

				}

			}

		}


		return true;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__focus  = {
			element: null,
			entity:  null
		};
		this.__scroll = {
			start: 0,
			delta: 0,
			min:   0
		};


		settings.relayout = false;


		lychee.ui.Layer.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.unbind('touch');

		this.bind('relayout', _on_relayout, this);
		this.bind('touch',    _on_touch,    this);
		this.bind('swipe',    _on_swipe,    this);

		this.bind('key', function(key, name, delta) {

			if (key === 'tab') {

				_on_tab.call(this, name);

			} else if (key === 'page-up') {

				_on_swipe.call(this, null, 'start');
				_on_swipe.call(this, null, 'move', null, null, {
					y: 128
				});

			} else if (key === 'page-down') {

				_on_swipe.call(this, null, 'start');
				_on_swipe.call(this, null, 'move', null, null, {
					y: -128
				});

			}

		}, this);

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		addEntity: function(entity) {

			entity = entity instanceof lychee.ui.Element ? entity : null;


			if (entity !== null) {

				var index = this.entities.indexOf(entity);
				if (index === -1) {

					this.entities.push(entity);
					this.trigger('relayout', []);

					return true;

				}

			}


			return false;

		},

		setVisible: function(visible) {

			if (visible === true || visible === false) {

				var relayout = false;
				if (this.visible === false && visible === true) {
					relayout = true;
				}


				this.visible = visible;


				if (relayout === true) {
					this.trigger('relayout', []);
				}


				return true;

			}


			return false;

		}

	};


	return Class;

});

