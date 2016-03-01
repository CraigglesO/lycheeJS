
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

		this.__buffer  = null;
		this.__pulse   = {
			active:   false,
			duration: 300,
			start:    null,
			alpha:    0.0
		};
		this.__label   = [];
		this.__lines   = [];
		this.__isDirty = false;


		this.setFont(settings.font);
		this.setModel(settings.model);
		this.setType(settings.type);
		this.setValue(settings.value);


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

global.__TABLE = this;

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


			if (blob.model instanceof Object) {

				var model = {};

				for (var property in blob.model) {
					model[property] = lychee.deserialize(blob.model[property]);
				}

				this.setModel(model);

			}


			if (blob.value instanceof Array) {
				this.setValue(blob.value);
			}

		},

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.Table';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.type !== Class.TYPE.horizontal) settings.type = this.type;


			if (this.font !== null) blob.font = lychee.serialize(this.font);


			if (Object.keys(this.model).length !== 0) {

				blob.model = {};

				for (var property in this.model) {
					blob.model[property] = lychee.serialize(this.model[property]);
				}

			}


			if (Object.values(this.value).length !== 0) {

				blob.value = this.value;

			}


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
			var model    = this.model;
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

				renderer.drawBox(
					x - hwidth,
					y - hheight,
					x + hwidth,
					y - hheight + 64,
					'#2f3736',
					true
				);


				renderer.drawBox(
					x - hwidth,
					y - hheight + 64,
					x + hwidth,
					y + hheight,
					'#363f3e',
					true
				);

			} else if (type === Class.TYPE.vertical) {

				renderer.drawBox(
					x - hwidth,
					y - hheight,
					x - hwidth + 96,
					y + hheight,
					'#2f3736',
					true
				);


				renderer.drawBox(
					x - hwidth + 96,
					y - hheight,
					x + hwidth,
					y + hheight,
					'#363f3e',
					true
				);

			}

			if (alpha !== 1) {
				renderer.setAlpha(1.0);
			}


			var buffer = this.__buffer;
			if (buffer === null) {
				this.__buffer = buffer = renderer.createBuffer(this.width, this.height);
			}


			if (this.__isDirty === true) {

				renderer.clear(buffer);
				renderer.setBuffer(buffer);
				renderer.setAlpha(1.0);


				var label = this.__label;
				var lines = this.__lines;
				var dim_x = 0;
				var dim_y = 0;
				var off_x = 0;
				var off_y = 0;


				if (type === Class.TYPE.horizontal) {

					off_x = 0;
					off_y = 0;
					dim_x = this.width / label.length;
					dim_y = 64;

					for (var l1 = 0, l1l = label.length; l1 < l1l; l1++) {

						renderer.drawText(
							off_x + dim_x / 2,
							off_y + dim_y / 2,
							label[l1],
							font,
							true
						);

						off_x += dim_x;

					}


//				for (var l2 = 0, l2l = lines.length; l2 < l2l; l2++) {
// TODO: Render lines
//				}


				} else if (type === Class.TYPE.vertical) {

					off_x = 0;
					off_y = 0;
					dim_x = 96;
					dim_y = 64;

					for (var l1 = 0, l1l = label.length; l1 < l1l; l1++) {

						renderer.drawText(
							off_x + dim_x / 2,
							off_y + dim_y / 2,
							label[l1],
							font,
							true
						);

						off_y += dim_y;

					}


// TODO: Render lines


				}


				renderer.setBuffer(null);
				this.__isDirty = false;

			}



/*
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
*/


			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}

			renderer.drawBuffer(
				x - hwidth,
				y - hheight,
				this.__buffer
			);

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

					var instance = model[property];
					if (lychee.interfaceof(lychee.ui.Entity, instance) === true) {
						this.model[property] = instance;
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
				this.__isDirty = true;


				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = value instanceof Array ? value : null;


			if (value !== null) {

				var model = this.model;


				this.value = value.filter(function(val) {
					return Object.keys(model).join(',') === Object.keys(val).join(',');
				});


				this.__label   = Object.keys(model).map(function(value) {
					return value.toUpperCase();
				});
				this.__isDirty = true;


				this.__lines = this.value.map(function(data) {

					var map = {};

					for (var property in data) {

						var value = data[property];
						if (value instanceof Array) {

							map[property] = value.map(function(val) {

								var instance = lychee.deserialize(lychee.serialize(model[property]));
								if (instance !== null) {
									instance.setValue(val);
								}

								return instance;

							});

						} else {

							var instance = lychee.deserialize(lychee.serialize(model[property]));
							if (instance !== null) {

								if (typeof instance.setLabel === 'function') {
									instance.setLabel(value);
								}

								if (typeof instance.setValue === 'function') {
									instance.setValue(value);
								}

							}

							map[property] = instance;

						}

					}

					return map;

				});


				return true;

			}


			return false;

		}

	};


	return Class;

});

