
lychee.define('lychee.ui.Text').includes([
	'lychee.ui.Entity'
]).exports(function(lychee, global, attachments) {

	var _font = attachments["fnt"];



	/*
	 * HELPERS
	 */

	var _get_chunks = function(str, width, max_w) {

		var chunks = [];
		var max_i  = (max_w / (width / str.length)) | 0;


		while (str.length > 0) {

			var index = str.lastIndexOf(' ', max_i);
			if (str.length > max_i && index > 0) {

				chunks.push(str.substr(0, index).trim());
				str = str.substr(index);

			} else {

				chunks.push(str.trim());

				break;

			}

		}


		return chunks;

	};

	var _on_relayout = function() {

		var that   = this;
		var font   = this.font;
		var label  = this.label;
		var width  = this.width;
		var height = this.height;

		if (font !== null && label !== null && width > 0) {

			this.__lines   = [];
			this.__isDirty = true;


			label.split('\n').forEach(function(line) {

				line = line.replace('\t', ' ');


				var dim = font.measure(line);
				var tmp = _get_chunks(line, dim.realwidth, width);
				if (tmp.length > 0) {

					for (var t = 0, tl = tmp.length; t < tl; t++) {
						that.__lines.push(tmp[t]);
					}

				} else {

					that.__lines.push('');

				}

			});


			this.height = this.__lines.length * font.lineheight;

			if (this.__buffer !== null) {
				this.__buffer.resize(this.width, this.height);
			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.font  = _font;
		this.label = null;

		this.__buffer  = null;
		this.__lines   = [];
		this.__isDirty = false;


		this.setFont(settings.font);

		delete settings.font;


		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;
		settings.width  = this.width;
		settings.height = this.height;


		lychee.ui.Entity.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('relayout', _on_relayout, this);


		this.setLabel(settings.label);

		settings = null;

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
			data['constructor'] = 'lychee.ui.Text';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.text !== null) settings.text = this.text;


			if (this.font !== null) blob.font = lychee.serialize(this.font);


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var alpha    = this.alpha;
			var font     = this.font;
			var position = this.position;
			var x        = position.x + offsetX;
			var y        = position.y + offsetY;
			var hwidth   = this.width  / 2;
			var hheight  = this.height / 2;


			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}


			var buffer = this.__buffer;
			if (buffer === null) {
				this.__buffer = buffer = renderer.createBuffer(this.width, this.height);
			}


			if (this.__isDirty === true) {

				var lh = font.lineheight;
				var ll = this.__lines.length;


				renderer.clear(buffer);
				renderer.setBuffer(buffer);


				for (var l = 0; l < ll; l++) {

					var text = this.__lines[l];


					renderer.drawText(
						0,
						0 + lh * l,
						text,
						font,
						false
					);

				}


				renderer.setBuffer(null);
				this.__isDirty = false;

			}


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

				// refresh the layout
				if (this.label !== null) {
					this.setLabel(this.label);
				}

				return true;

			}


			return false;

		},

		setLabel: function(label) {

			label = typeof label === 'string' ? label : null;


			if (label !== null) {

				this.label = label;
				this.trigger('relayout', []);

				return true;

			}


			return false;

		}

	};


	return Class;

});

