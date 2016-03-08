
lychee.define('app.ui.Profile').includes([
	'lychee.ui.Layer'
]).requires([
	'lychee.ui.entity.Input'
]).exports(function(lychee, app, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.relayout = false;


		lychee.ui.Layer.call(this, settings);

		settings = null;

	};


	Class.prototype = {

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
				'#2f3736',
				true
			);

			if (alpha !== 0) {
				lychee.ui.Layer.prototype.render.call(this, renderer, offsetX, offsetY);
			}

			if (alpha !== 1) {
				renderer.setAlpha(1.0);
			}

		}

	};


	return Class;

});

