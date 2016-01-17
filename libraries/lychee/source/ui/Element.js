
lychee.define('lychee.ui.Element').requires([
	'lychee.ui.Button',
	'lychee.ui.Label'
]).includes([
	'lychee.ui.Layer'
]).exports(function(lychee, global, attachments) {

	var _fonts = {
		label: attachments["label.fnt"],
		step:  attachments["step.fnt"]
	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.label  = 'CONTENT';
		this.action = 'Next';


		settings.width  = 256;
		settings.height = 448;


		lychee.ui.Layer.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.setEntity('step', new lychee.ui.Label({
			label: '1',
			font:  _fonts.step
		}));

		this.setEntity('label', new lychee.ui.Label({
			label: this.label,
			font:  _fonts.label
		}));

		this.setEntity('action', new lychee.ui.Button({
			label: this.action
		}));

		this.getEntity('action').bind('touch', function(id, position, delta) {
			this.trigger('change', [ this.action.toLowerCase() ]);
		}, this);

		this.bind('reshape', function(orientation, rotation, width, height) {

			var entity = null;
			var x1     = -1/2 * this.width;
			var y1     = -1/2 * this.height;
			var x2     =  1/2 * this.width;
			var y2     =  1/2 * this.height;
			var step_w = 0;

			entity = this.getEntity('step');
			step_w = entity.width;
			entity.position.x = x1 + 16 + step_w / 2;
			entity.position.y = y1 + 32 - 1;

			entity = this.getEntity('label');
			entity.position.x = x1 + 32 + step_w + entity.width / 2;
			entity.position.y = y1 + 32;

			entity = this.getEntity('action');
			entity.position.x = x2 - 16 - entity.width / 2;
			entity.position.y = y2 - 32;

		}, this);


		this.setLabel(settings.label);
		this.setAction(settings.action);

		delete settings.label;
		delete settings.action;

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.ui.Layer.prototype.serialize.call(this);
			data['constructor'] = 'lyche.ui.Element';

			var settings = data['arguments'][0];
			var blob     = (data['blob'] || {});


			if (this.label !== 'MENU')  settings.label  = this.label;
			if (this.action !== 'Next') settings.action = this.action;


			data['blob'] = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},

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

		setAction: function(action) {

			action = typeof action === 'string' ? action : null;


			if (action !== null) {

				this.getEntity('action').setLabel(action);
				this.action = action;


				return true;

			}


			return false;

		},

		setLabel: function(label) {

			label = typeof label === 'string' ? label : null;


			if (label !== null) {

				this.getEntity('label').setLabel(label);
				this.label = label;


				return true;

			}


			return false;

		}

	};


	return Class;

});

