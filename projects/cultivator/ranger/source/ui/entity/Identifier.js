
lychee.define('app.ui.entity.Identifier').includes([
	'lychee.ui.entity.Label'
]).exports(function(lychee, app, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		lychee.ui.entity.Label.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.entity.Label.prototype.serialize.call(this);
			data['constructor'] = 'app.ui.entity.Identifier';


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var alpha    = this.alpha;
			var position = this.position;

			var x1 = position.x + offsetX - this.width  / 2;
			var y1 = position.y + offsetY - this.height / 2;


			var font  = this.font;
			var value = this.value;


			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}


			if (font !== null) {

				renderer.drawText(
					x1,
					y1,
					value,
					font,
					false
				);

			}


			if (alpha !== 1) {
				renderer.setAlpha(1.0);
			}

		},



		/*
		 * CUSTOM API
		 */

		setValue: function(value) {

			value = typeof value === 'string' ? value : null;


			if (value !== null) {

				this.value = value;


				return true;

			}


			return false;

		}

	};


	return Class;

});

