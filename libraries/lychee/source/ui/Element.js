
lychee.define('lychee.ui.Element').requires([
	'lychee.ui.Button',
	'lychee.ui.Label',
	'lychee.ui.Text'
]).includes([
	'lychee.ui.Layer'
]).exports(function(lychee, global, attachments) {

	var _fonts = {
		label: attachments["label.fnt"],
		step:  attachments["step.fnt"]
	};



	/*
	 * HELPERS
	 */

	var _on_relayout = function() {

		var content = this.__content;
		var entity  = null;
		var label   = null;
		var layout  = [
			this.getEntity('step'),
			this.getEntity('label'),
			this.getEntity('action')
		];


		var x1 = -1/2 * this.width;
		var x2 =  1/2 * this.width;
		var y1 = -1/2 * this.height;
		var y2 =  1/2 * this.height;


		if (content.length % 2 === 0) {

			var offset   = 64 + 16;
			var boundary = 0;

			for (var c = 0, cl = content.length; c < cl; c += 2) {

				entity   = content[c]     || null;
				label    = content[c + 1] || null;
				boundary = 0;

				if (label !== null) {

					label.width       =  1/2 * (this.width - 32);
					label.position.x  = -1/4 * (this.width - 32);
					label.position.y  =   y1 + offset + label.height / 2;

					entity.width      =  1/2 * (this.width - 32);
					entity.position.x =  1/4 * (this.width - 32);
					entity.position.y =   y1 + offset + entity.height / 2;
					entity.trigger('relayout', []);

					boundary = Math.max(label.height, entity.height);
					label.position.y  = y1 + offset + boundary / 2;
					entity.position.y = y1 + offset + boundary / 2;

					offset += boundary + 16;

				} else {

					entity.width      = this.width - 32;
					entity.position.x = 0;
					entity.position.y = y1 + offset + entity.height / 2;
					entity.trigger('relayout', []);

					boundary = entity.height;
					entity.position.y = y1 + offset + boundary / 2;

					offset += boundary + 16;

				}

			}

		}


		var step_width = 0;

		entity = layout[0];
		step_w = entity.width;
		entity.position.x = x1 + 16 + step_width / 2;
		entity.position.y = y1 + 32 - 1;

		entity = layout[1];
		entity.position.x = x1 + 32 + step_width + entity.width / 2;
		entity.position.y = y1 + 32;

		entity = layout[2];
		entity.position.x = x2 - 16 - entity.width / 2;
		entity.position.y = y2 - 32;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.label     = 'CONTENT';
		this.action    = 'Next';

		this.__content = [];


		settings.width    = 256;
		settings.height   = 386;
		settings.relayout = false;


		lychee.ui.Layer.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		lychee.ui.Layer.prototype.setEntity.call(this, 'step', new lychee.ui.Label({
			label: '1',
			font:  _fonts.step
		}));

		lychee.ui.Layer.prototype.setEntity.call(this, 'label', new lychee.ui.Label({
			label: this.label,
			font:  _fonts.label
		}));

		lychee.ui.Layer.prototype.setEntity.call(this, 'action', new lychee.ui.Button({
			label: this.action
		}));

		this.getEntity('action').bind('touch', function(id, position, delta) {
			this.trigger('change', [ this.action.toLowerCase() ]);
		}, this);


		this.__content = [];

		this.bind('relayout', _on_relayout, this);


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

		addEntity: function(entity) {

			var result = lychee.ui.Layer.prototype.addEntity.call(this, entity);
			if (result === true) {
				this.__content.push(entity);
				this.__content.push(null);
			}

			return result;

		},

		setEntity: function(id, entity) {

			var result = lychee.ui.Layer.prototype.setEntity.call(this, id, entity);
			if (result === true) {

				var label = new lychee.ui.Label({
					label: id
				});


				this.entities.push(label);


				var index = this.__content.length - 1;
				if (this.__content[index] === null) {
					this.__content[index] = label;
				}

			}

			return result;

		},

		removeEntity: function(entity) {

			var result = lychee.ui.Layer.prototype.removeEntity.call(this, entity);
			if (result === true) {

				var index = this.__content.indexOf(entity);
				if (index !== -1) {

					var label = this.__content[index + 1];
					var tmp   = this.entities.indexOf(label);
					if (tmp !== -1) {
						this.entities.splice(tmp, 1);
					}


					this.__content.splice(index, 2);

				}

			}

			return result;

		},

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

