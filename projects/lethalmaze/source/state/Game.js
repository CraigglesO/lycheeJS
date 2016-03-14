
lychee.define('game.state.Game').requires([
	'lychee.app.Layer',
	'lychee.effect.Lightning',
	'lychee.ui.Layer',
	'game.app.sprite.Tank',
	'game.data.Level',
	'game.ui.entity.Timeout',
	'game.ui.layer.Control'
]).includes([
	'lychee.app.State'
]).exports(function(lychee, game, global, attachments) {

	var _BLOB   = attachments["json"].buffer;
	var _LEVELS = attachments["levels.json"].buffer;
	var _MUSIC  = attachments["msc"];



	/*
	 * HELPERS
	 */

	var _on_init = function(data) {

		var control = this.queryLayer('ui', 'control');
		var timeout = this.queryLayer('ui', 'timeout');
		var objects = this.queryLayer('game', 'objects');

		if (control !== null && timeout !== null) {

			for (var p = 0, pl = data.players.length; p < pl; p++) {

				var tank = this.__tanks[p] || null;
				if (tank !== null) {

					if (data.tid === p) {

						tank.addEffect(new lychee.effect.Lightning({
							type:     lychee.effect.Lightning.TYPE.easeout,
							duration: 3000,
							origin:   this.__origin
						}));

						control.setTank(tank);
						objects.addEntity(tank);
						this.__players.push(tank);

					} else {

						tank.addEffect(new lychee.effect.Lightning({
							type:     lychee.effect.Lightning.TYPE.easeout,
							duration: 3000,
							origin:   this.__origin
						}));

						objects.addEntity(tank);
						this.__players.push(tank);

					}

				}

			}


			timeout.setTimeout(data.timeout);
			timeout.setVisible(true);
			control.setVisible(false);

		}

	};

	var _on_update = function(data) {

		if (data.players === undefined) return;


		var timeout = this.queryLayer('ui', 'timeout');
		if (timeout !== null) {
			timeout.setTimeout(data.timeout);
		}


		var objects = this.queryLayer('game', 'objects');
		if (objects !== null) {

			if (this.__players.length < data.players.length) {

				for (var p = this.__players.length, pl = data.players.length; p < pl; p++) {

					var tank = this.__tanks[p] || null;
					if (tank !== null) {

						if (data.tid === p) {

							tank.addEffect(new lychee.effect.Lightning({
								type:     lychee.effect.Lightning.TYPE.easeout,
								duration: 3000,
								origin:   this.__origin
							}));

							control.setTank(tank);
							objects.addEntity(tank);
							this.__players.push(tank);

						} else {

							tank.addEffect(new lychee.effect.Lightning({
								type:     lychee.effect.Lightning.TYPE.easeout,
								duration: 3000,
								origin:   this.__origin
							}));

							objects.addEntity(tank);
							this.__players.push(tank);

						}

					}

				}

			} else if (this.__players.length > data.players.length) {

				for (var p = 0, pl = this.__players.length; p < pl; p++) {

					var tank = this.__tanks[p] || null;
					if (tank !== null) {

						if (p >= data.players.length) {

							objects.removeEntity(tank);
							this.__players.splice(p, 1);
							pl--;
							p--;

						} else {

							if (data.tid === p) {
								control.setTank(tank);
							}

						}

					}

				}

			}

		}


		if (data.timeout === 0) {
			_on_start.call(this);
		}

	};

	var _on_start = function() {

		var control = this.queryLayer('ui', 'control');
		var timeout = this.queryLayer('ui', 'timeout');

		if (control !== null && timeout !== null) {

			control.setVisible(true);
			timeout.setVisible(false);

		}


console.log('START', this.__players);

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.app.State.call(this, main);


		this.__players = [];
		this.__origin  = {
			x: 384,
			y: 384
		};


		this.deserialize(_BLOB);



		/*
		 * INITIALIZATION
		 */

		var viewport = this.viewport;
		if (viewport !== null) {

			viewport.bind('reshape', function(orientation, rotation) {

				var renderer = this.renderer;
				if (renderer !== null) {

					var entity = null;
					var width  = renderer.width;
					var height = renderer.height;


					entity = this.getLayer('game');
					entity.offset.x = -1/2 * width;
					entity.offset.y = -1/2 * height;

					entity = this.queryLayer('ui', 'timeout');
					entity.width  = width;
					entity.height = height;


					this.__origin.x = width  / 2;
					this.__origin.y = height / 2;

				}

			}, this);

		}

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.app.State.prototype.serialize.call(this);
			data['constructor'] = 'game.state.Game';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		enter: function(oncomplete, data) {

			data = data instanceof Object ? data : { level: 'intro' };


			lychee.app.State.prototype.enter.call(this, oncomplete);


			var level = game.data.Level.decode(_LEVELS[data.level] || null) || null;
			if (level !== null) {

				this.__tanks = level.objects.filter(function(entity) {
					return entity instanceof game.app.sprite.Tank;
				});

				level.objects = level.objects.filter(function(entity) {
					return !(entity instanceof game.app.sprite.Tank);
				});


				this.queryLayer('game', 'terrain').setEntities(level.terrain);
				this.queryLayer('game', 'objects').setEntities(level.objects);


				var client = this.client;
				if (client !== null) {

					var service = client.getService('control');
					if (service !== null) {

						service.bind('init',   _on_init,   this);
						service.bind('update', _on_update, this);
						service.bind('start',  _on_start,  this);

					}

				}


				this.queryLayer('ui', 'control').setVisible(false);
				this.queryLayer('ui', 'timeout').setVisible(true);


				this.__tanks.forEach(function(tank) {

					tank.addEffect(new lychee.effect.Lightning({
						type:     lychee.effect.Lightning.TYPE.easeout,
						duration: 5000,
						position: this.__origin
					}));

				}.bind(this));

			}


			var jukebox = this.jukebox;
			if (jukebox !== null) {
				jukebox.setVolume(0.25);
				jukebox.play(_MUSIC);
			}

		},

		leave: function(oncomplete) {

			this.queryLayer('game', 'terrain').setEntities([]);
			this.queryLayer('game', 'objects').setEntities([]);


			var jukebox = this.jukebox;
			if (jukebox !== null) {
				jukebox.stop(_MUSIC);
			}


			var client = this.client;
			if (client !== null) {

				var service = client.getService('control');
				if (service !== null) {

					service.unbind('init',   _on_init,   this);
					service.unbind('update', _on_update, this);
					service.unbind('start',  _on_start,  this);

				}

			}


			lychee.app.State.prototype.leave.call(this, oncomplete);

		}

	};


	return Class;

});

