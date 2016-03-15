
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

	var _spawn = function(tank) {

		if (tank.effects.length === 0) {

			tank.addEffect(new lychee.effect.Lightning({
				type:     lychee.effect.Lightning.TYPE.easeout,
				duration: 3000,
				position: {
					x: this.__origin.x,
					y: this.__origin.y
				}
			}));

		}


		var objects = this.queryLayer('game', 'objects');
		if (objects.entities.indexOf(tank) === -1) {
			objects.addEntity(tank);
		}

		if (this.__players.indexOf(tank) === -1) {
			this.__players.push(tank);
		}

	};

	var _kill = function(tank) {

		if (tank.effects.length === 0) {

			tank.addEffect(new lychee.effect.Lightning({
				type:     lychee.effect.Lightning.TYPE.easeout,
				duration: 1000,
				position: {
					x: this.__origin.x,
					y: this.__origin.y
				}
			}));

		}


		var objects = this.queryLayer('game', 'objects');
		if (objects.entities.indexOf(tank) !== -1) {
			objects.removeEntity(tank);
		}

		var index = this.__players.indexOf(tank);
		if (index !== -1) {
			this.__players.splice(index, 1);
		}

	};

	var _on_init = function(data) {

console.log('INIT', data.sid);

		var control = this.queryLayer('ui', 'control');
		var timeout = this.queryLayer('ui', 'timeout');

		if (control !== null && timeout !== null) {

			for (var p = 0, pl = data.players.length; p < pl; p++) {

				var tank = this.__tanks[p] || null;
				if (tank !== null) {

					if (data.tid === p) {
						this.__player = tank;
					}

					_spawn.call(this, tank);

				}

			}


			timeout.setTimeout(data.timeout);
			timeout.setVisible(true);
			control.setVisible(false);

		}

	};

	var _on_control = function(data) {

		var player = this.__player;
		var tid    = data.tid || null;
		if (tid !== null) {
			player = this.__players[tid] || null;
		}


		if (player !== null) {

			if (data.action === 'move') {
				player.move(data.direction);
			} else if (data.action === 'shoot') {
				player.shoot();
			}

		}

	};

	var _on_update = function(data) {

		if (data.players === undefined) return;


		var control = this.queryLayer('ui', 'control');
		var timeout = this.queryLayer('ui', 'timeout');


		if (timeout !== null) {
			timeout.setTimeout(data.timeout);
		}


		if (this.__players.length < data.players.length) {

			for (var p = this.__players.length, pl = data.players.length; p < pl; p++) {

				var tank = this.__tanks[p] || null;
				if (tank !== null) {

					if (data.tid === p) {
						this.__player = tank;
					}

					_spawn.call(this, tank);

				}

			}

		} else if (this.__players.length > data.players.length) {

			for (var p = 0, pl = this.__players.length; p < pl; p++) {

				var tank = this.__tanks[p] || null;
				if (tank !== null) {

					if (p >= data.players.length) {

						_kill.call(this, tank);
						pl--;
						p--;

					} else {

						if (data.tid === p) {
							this.__player = tank;
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

			this.__focus = control;

		}


console.log('START', this.__players.map(function(tank) {
	return tank.id;
}));

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.app.State.call(this, main);


		this.__player  = null;
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

					entity = this.queryLayer('ui', 'control');
					entity.width  = width;
					entity.height = height;
					entity.trigger('relayout');

					entity = this.queryLayer('ui', 'timeout');
					entity.width  = width;
					entity.height = height;
					entity.trigger('relayout');


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

		deserialize: function(blob) {

			lychee.app.State.prototype.deserialize.call(this, blob);


			this.queryLayer('ui', 'control').bind('change', _on_control, this);

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

						service.bind('init',    _on_init,    this);
						service.bind('update',  _on_update,  this);
						service.bind('start',   _on_start,   this);
						service.bind('control', _on_control, this);

					}

				}


				this.queryLayer('ui', 'control').setVisible(false);
				this.queryLayer('ui', 'timeout').setVisible(true);

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

					service.unbind('init',    _on_init,    this);
					service.unbind('update',  _on_update,  this);
					service.unbind('start',   _on_start,   this);
					service.unbind('control', _on_control, this);

				}

			}


			lychee.app.State.prototype.leave.call(this, oncomplete);

		}

	};


	return Class;

});

