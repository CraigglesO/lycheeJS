
lychee.define('lychee.ui.Table').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global, attachments) {

	var _font = attachments["fnt"];



	/*
	 * HELPERS
	 */

	var _resolve_reference = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}

		return pointer;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font  = _font;
		this.model = {};
		this.type  = Class.TYPE.horizontal;
		this.value = [];

		this.__pulse  = {
			active:   false,
			duration: 300,
			start:    null,
			alpha:    0.0
		};


		this.setFont(settings.font);
		this.setModel(settings.model);
		this.setType(settings.type);


		settings.shape = lychee.ui.Entity.SHAPE.rectangle;


		if (this.type === Class.TYPE.horizontal) {
			settings.width  = typeof settings.width === 'number'  ? settings.width  : 512;
			settings.height = typeof settings.height === 'number' ? settings.height : 384;
		} else if (this.type === Class.TYPE.vertical) {
			settings.width  = typeof settings.width === 'number'  ? settings.width  : 384;
			settings.height = typeof settings.height === 'number' ? settings.height : 512;
		}


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

	};


	Class.TYPE = {
		horizontal: 0,
		vertical:   1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			var font = lychee.deserialize(blob.font);
			if (font !== null) {
				this.setFont(font);
			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.Table';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (Object.keys(this.model).length !== 0)   settings.model = this.model;
			if (this.type !== Class.TYPE.horizontal)    settings.type  = this.type;
			if (Object.values(this.value).length !== 0) settings.value = this.value;


			if (this.font !== null) blob.font = lychee.serialize(this.font);


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		update: function(clock, delta) {

			var pulse = this.__pulse;
			if (pulse.active === true) {

				if (pulse.start === null) {
					pulse.start = clock;
				}

				var pt = (clock - pulse.start) / pulse.duration;
				if (pt <= 1) {
					pulse.alpha = (1 - pt);
				} else {
					pulse.alpha  = 0.0;
					pulse.active = false;
				}

			}


			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var alpha    = this.alpha;
			var font     = this.font;
			var position = this.position;
			var type     = this.type;
			var x        = position.x + offsetX;
			var y        = position.y + offsetY;
			var hwidth   = (this.width  - 2) / 2;
			var hheight  = (this.height - 2) / 2;


			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}

			if (type === Class.TYPE.horizontal) {

			} else if (type === Class.TYPE.vertical) {

			}



			var pulse = this.__pulse;
			if (pulse.active === true) {

				renderer.setAlpha(pulse.alpha);

				renderer.drawCircle(
					cx,
					cy,
					12,
					'#32afe5',
					true
				);

				renderer.setAlpha(1.0);

			}


			if (alpha !== 1) {
				renderer.setAlpha(1.0);
			}

		},



		/*
		 * CUSTOM API
		 */

		setFont: function(font) {

			font = font instanceof Font ? font : null;


			if (font !== null) {

				this.font = font;

				return true;

			}


			return false;

		},

		setModel: function(model) {

			model = model instanceof Object ? model : null;


			if (model !== null) {

				this.model = {};

				for (var property in model) {

					var reference = model[property];
					var construct = _resolve_reference.call(global, reference);
					if (construct !== null) {
						this.model[property] = reference;
					}

				}


				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Class.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = value instanceof Array ? value : null;


			if (value !== null) {

				this.value = value.filter(function(val) {
					return lychee.interfaceof(this.model, val);
				}.bind(this));


				return true;

			}


			return false;

		}

	};


	return Class;

});

