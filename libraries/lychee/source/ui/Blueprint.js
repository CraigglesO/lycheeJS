
lychee.define('lychee.ui.Blueprint').requires([
	'lychee.effect.Alpha',
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


			for (var e = 0, el = this.entities.length; e < el; e++) {

				var entity = this.entities[e];
				var pos_x  = offset_x + entity.width  / 2;
				var pos_y  = offset_y + entity.height / 2;

				if (pos_x > x2) {

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

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.relayout = false;


		lychee.ui.Layer.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('relayout', _on_relayout, this);

	};


	Class.prototype = {

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

