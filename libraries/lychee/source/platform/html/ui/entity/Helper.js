
lychee.define('lychee.ui.entity.Helper').tags({
	platform: 'html'
}).includes([
	'lychee.ui.entity.Button'
]).supports(function(lychee, global) {

	if (typeof global.document !== 'undefined') {

		if (typeof global.document.createElement === 'function') {
			return true;
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	var _texture = attachments["png"];
//	var _config  = attachments["json"].buffer;

	var _config = {map:{}};

console.log(attachments);



	/*
	 * HELPERS
	 */

	var _is_value = function(value) {

		value = typeof value === 'string' ? value : null;


		if (value !== null) {

			var action   = value.split('=')[0] || '';
			var resource = value.split('=')[1] || '';
			var data     = value.split('=')[2] || '';


			if (action === 'boot' && resource !== '') {

				return true;

			} else if (action === 'profile' && resource !== '' && data !== '') {

				return true;

			} else if (action === 'unboot') {

				return true;

			} else if (action.match(/start|stop|edit|file|web/g) && resource !== '') {

				return true;

			}

		}


		return false;

	};

	var _help = function(value) {

		var element = global.document.createElement('a');

		element.href = 'lycheejs://' + value;

		element.click();


		return true;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({
			label: 'HELPER'
		}, data);


		this.__action = null;


		lychee.ui.entity.Button.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.unbind('touch');
		this.bind('touch', function() {

			var value = this.value;
			if (value !== null) {

				var result = _help(this.value);
				if (result === true) {
					this.trigger('change', [ this.value ]);
				}

			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var alpha    = this.alpha;
			var position = this.position;
			var x        = position.x + offsetX;
			var y        = position.y + offsetY;
			var hwidth   = this.width  / 2;
			var hheight  = this.height / 2;


			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}


			renderer.drawBox(
				x - hwidth,
				y - hheight,
				x + hwidth,
				y + hheight,
				'#545454',
				true
			);


			var pulse = this.__pulse;
			if (pulse.active === true) {

				renderer.setAlpha(pulse.alpha);

				renderer.drawBox(
					x - hwidth,
					y - hheight,
					x + hwidth,
					y + hheight,
					'#32afe5',
					true
				);

				renderer.setAlpha(1.0);

			}


			var action = this.__action;
			if (action !== null) {

				var map = _config.map[action] || null;
				if (map !== null) {

					renderer.drawSprite(
						x - hwidth,
						y - hheight,
						_texture,
						map
					);

				}

			}


			var label = this.label;
			var font  = this.font;

			if (label !== null && font !== null) {

				renderer.drawText(
					x,
					y,
					label,
					font,
					true
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

			value = _is_value(value) === true ? value : null;


			if (value !== null) {

				this.value    = value;
				this.__action = value.split('=')[0] || null;

				return true;

			}


			return false;

		}

	};


	return Class;

});

