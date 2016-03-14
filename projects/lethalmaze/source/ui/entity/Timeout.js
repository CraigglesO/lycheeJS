
lychee.define('game.ui.entity.Timeout').requires([
	'lychee.effect.Alpha',
	'lychee.effect.Shake',
	'lychee.effect.Visible'
]).includes([
	'lychee.ui.Entity'
]).exports(function(lychee, game, global, attachments) {

	var _FONT  = attachments["fnt"];
	var _SOUND = attachments["snd"];



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.timeout = 30000;


		this.__timeout = {
			active: false,
			value:  30000,
			number: 30,
			start:  null
		};


		this.setTimeout(settings.timeout);

		delete settings.timeout;


		settings.width  = typeof settings.width === 'number' ? settings.width : 512;
		settings.height = typeof settings.height === 'number' ? settings.height : 512;
		settings.shape  = lychee.ui.Entity.SHAPE.rectangle;


		lychee.ui.Entity.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('touch', function() {}, this);

		this.bind('key', function(key, name, delta) {

console.log(key, name, delta);

		}, this);

		this.bind('focus', function() {
			this.setState('active');
		}, this);

		this.bind('blur', function() {
			this.setState('default');
		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.Entity.prototype.serialize.call(this);
			data['constructor'] = 'game.ui.entity.Timeout';


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
				y + hheight,
				'#32afe5',
				true
			);


			var number = this.__timeout.number;
			var label  = '';
			if (number <= 0) {
				label = 'Fight!';
			} else {
				label = '' + number;
			}


			renderer.drawText(
				x,
				y,
				label,
				_FONT,
				true
			);


			if (alpha !== 1) {
				renderer.setAlpha(1.0);
			}

		},

		update: function(clock, delta) {


			var timeout = this.__timeout;
			if (timeout.active === true) {

				if (timeout.start === null) {
					timeout.start = clock;
				}

				var t = (clock - timeout.start) / this.timeout;
				if (t <= 1) {

					timeout.value = (1 - t) * this.timeout;


					var number = Math.round(timeout.value / 1000);
					if (number < timeout.number) {

						timeout.number = number;
						this.alpha     = 1.0;

						_SOUND.play();

						this.addEffect(new lychee.effect.Alpha({
							type:     lychee.effect.Alpha.TYPE.easeout,
							alpha:    0.0,
							duration: 800
						}));

					}

				} else {

					timeout.number = 0;
					timeout.value  = 0;
					timeout.active = false;

				}


				if (timeout.value <= 0) {
					this.trigger('init');
				}

			}


			lychee.ui.Entity.prototype.update.call(this, clock, delta);

		},



		/*
		 * CUSTOM API
		 */

		setTimeout: function(value) {

			value = typeof value === 'number' ? (value | 0) : null;


			if (value !== null) {

				var timeout = this.__timeout;


				timeout.value  = value;
				timeout.number = Math.round(value / 1000);
				timeout.start  = null;
				timeout.active = true;


				this.timeout = value;


				return true;

			}


			return false;

		},

		setVisible: function(visible) {

			if (visible === true) {

				this.addEffect(new lychee.effect.Alpha({
					type:     lychee.effect.Alpha.TYPE.easeout,
					alpha:    1.0,
					duration: 300
				}));

				this.addEffect(new lychee.effect.Visible({
					delay:   300,
					visible: true
				}));


				return true;

			} else if (visible === false) {

				this.addEffect(new lychee.effect.Alpha({
					type:     lychee.effect.Alpha.TYPE.easeout,
					alpha:    0.0,
					duration: 300
				}));

				this.addEffect(new lychee.effect.Visible({
					delay:   300,
					visible: true
				}));


				return true;

			}


			return false;

		}

	};


	return Class;

});

