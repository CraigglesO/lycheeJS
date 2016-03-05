
lychee.define('lychee.ui.Table').includes([
	'lychee.ui.Layer'
]).requires([
	'lychee.ui.Label'
]).exports(function(lychee, global, attachments) {

	var _font = attachments["fnt"];



	/*
	 * HELPERS
	 */

	var _on_relayout = function() {

		var type = this.type;
		var x1   = -1/2 * this.width;
		var y1   = -1/2 * this.height;
		var x2   =  1/2 * this.width;
		var y2   =  1/2 * this.height;


		if (this.entities.length === 0) {

			if (type === Class.TYPE.horizontal) {

				off_x = 0;
				off_y = 64;
				dim_x = this.width / this.__label.length;
				dim_y = 64;

				for (var v = 0, vl = this.value.length; v < vl; v++) {

					var object = this.value[v];

					for (var property in object) {

						var entity = lychee.deserialize(this.model[property]);
						var value  = object[property];

						if (entity !== null) {

							if (typeof value === 'string') {
								entity.setValue(value);
							} else if (value instanceof Object) {
								entity.setLabel(value.label);
								entity.setValue(value.value);
							}


						} else {

							entity = new lychee.ui.Label({
								value: '(Invalid UI Entity)'
							});

						}


						entity.position.x = x1 + off_x + dim_x / 2;
						entity.position.y = y1 + off_y + dim_y / 2;
						entity.trigger('relayout');

						this.entities.push(entity);

						off_x += dim_x;

					}


					off_x  = 0;
					off_y += dim_y;

				}

			} else if (type === Class.TYPE.vertical) {

				off_x = 96;
				off_y = 0;
				dim_x = (this.width - 96) / this.value.length;
				dim_y = this.height / this.__label.length;


				for (var v = 0, vl = this.value.length; v < vl; v++) {

					var object = this.value[v];

					for (var property in object) {

						var entity = lychee.deserialize(this.model[property]);
						var value  = object[property];

						if (entity !== null) {

							if (typeof value === 'string') {
								entity.setValue(value);
							} else if (value instanceof Object) {
								entity.setLabel(value.label);
								entity.setValue(value.value);
							}

						} else {

							entity = new lychee.ui.Label({
								value: '(Invalid UI Entity)'
							});

						}


						entity.position.x = x1 + off_x + dim_x / 2;
						entity.position.y = y1 + off_y + dim_y / 2;
						entity.trigger('relayout');

						this.entities.push(entity);

						off_y += dim_y;

					}


					off_x += dim_x;
					off_y  = 0;

				}

			}

		} else {

			if (type === Class.TYPE.horizontal) {

				off_x = 0;
				off_y = 64;
				dim_x = this.width / this.__label.length;
				dim_y = 64;

				for (var v = 0, e = 0, vl = this.value.length; v < vl; v++) {

					var object = this.value[v];

					for (var property in object) {

						var entity = this.entities[e];
						if (entity !== null) {

							entity.width      = dim_x;
							entity.height     = dim_y;
							entity.position.x = x1 + off_x + dim_x / 2;
							entity.position.y = y1 + off_y + dim_y / 2;
							entity.trigger('relayout');

						}

						off_x += dim_x;
						e++;

					}

					off_x  = 0;
					off_y += dim_y;

				}

			} else if (type === Class.TYPE.vertical) {

				off_x = 96;
				off_y = 0;
				dim_x = (this.width - 96) / this.value.length;
				dim_y = this.height / this.__label.length;


				for (var v = 0, e = 0, vl = this.value.length; v < vl; v++) {

					var object = this.value[v];

					for (var property in object) {

						var entity = this.entities[e];
						if (entity !== null) {

							entity.width      = dim_x;
							entity.height     = dim_y;
							entity.position.x = x1 + off_x + dim_x / 2;
							entity.position.y = y1 + off_y + dim_y / 2;
							entity.trigger('relayout');

						}


						off_y += dim_y;
						e++;

					}


					off_x += dim_x;
					off_y  = 0;

				}

			}

		}

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

		this.__label = [];


		this.setFont(settings.font);
		this.setModel(settings.model);
		this.setType(settings.type);
		this.setValue(settings.value);


		if (this.type === Class.TYPE.horizontal) {
			settings.width  = typeof settings.width === 'number'  ? settings.width  : 512;
			settings.height = typeof settings.height === 'number' ? settings.height : 384;
		} else if (this.type === Class.TYPE.vertical) {
			settings.width  = typeof settings.width === 'number'  ? settings.width  : 384;
			settings.height = typeof settings.height === 'number' ? settings.height : 512;
		}


		settings.relayout = false;


		lychee.ui.Layer.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.unbind('relayout');
		this.bind('relayout', _on_relayout, this);

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

			var data = lychee.ui.Layer.prototype.serialize.call(this);
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

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var alpha    = this.alpha;
			var font     = this.font;
			var label    = this.__label;
			var model    = this.model;
			var position = this.position;
			var type     = this.type;
			var value    = this.value;


			var x1    = position.x + offsetX - this.width  / 2;
			var y1    = position.y + offsetY - this.height / 2;
			var x2    = position.x + offsetX + this.width  / 2;
			var y2    = position.y + offsetY + this.height / 2;
			var dim_x = 0;
			var dim_y = 0;
			var off_x = 0;
			var off_y = 0;



			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}

			if (type === Class.TYPE.horizontal) {

				renderer.drawBox(
					x1,
					y1,
					x2,
					y1 + 64,
					'#2f3736',
					true
				);

				renderer.drawBox(
					x1,
					y1 + 64,
					x2,
					y2,
					'#363f3e',
					true
				);


				off_x = 0;
				off_y = 0;
				dim_x = this.width / label.length;
				dim_y = 64;

				for (var l = 0, ll = label.length; l < ll; l++) {

					renderer.drawText(
						x1 + off_x + dim_x / 2,
						y1 + off_y + dim_y / 2,
						label[l],
						font,
						true
					);

					off_x += dim_x;

				}

			} else if (type === Class.TYPE.vertical) {

				renderer.drawBox(
					x1,
					y1,
					x1 + 96,
					y2,
					'#2f3736',
					true
				);

				renderer.drawBox(
					x1 + 96,
					y1,
					x2,
					y2,
					'#363f3e',
					true
				);


				off_x = 0;
				off_y = 0;
				dim_x = 96;
				dim_y = this.height / label.length;

				for (var l = 0, ll = label.length; l < ll; l++) {

					renderer.drawText(
						x1 + off_x + dim_x / 2,
						y1 + off_y + dim_y / 2,
						label[l],
						font,
						true
					);

					off_y += dim_y;

				}

			}


			if (alpha !== 0) {
				lychee.ui.Layer.prototype.render.call(this, renderer, offsetX, offsetY);
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

					var instance = model[property];
					if (instance !== null && typeof instance.setValue === 'function') {
						this.model[property] = lychee.serialize(model[property]);
					} else {
						this.model[property] = null;
					}

				}


				this.__label = Object.keys(this.model).map(function(label) {
					return label.toUpperCase();
				});


				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Class.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;
				this.trigger('relayout');

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = value instanceof Array ? value : null;


			if (value !== null) {

				var model = Object.keys(this.model).join(',');

				this.entities = [];
				this.value    = value.filter(function(val) {
					return model === Object.keys(val).join(',');
				});
				this.trigger('relayout');


				return true;

			}


			return false;

		}

	};


	return Class;

});

