
lychee.define('game.state.Game').requires([
	'lychee.app.Layer',
	'lychee.effect.Lightning',
	'lychee.effect.Shake',
	'lychee.ui.Layer',
	'game.app.sprite.Bullet',
	'game.app.sprite.Item',
	'game.app.sprite.Tank',
	'game.data.Level',
	'game.effect.Explosion',
	'game.ui.entity.Timeout',
	'game.ui.layer.Control'
]).includes([
	'lychee.app.State'
]).exports(function(lychee, game, global, attachments) {

	var _BLOB   = attachments["json"].buffer;
	var _LEVELS = attachments["levels.json"].buffer;
	var _MUSIC  = attachments["msc"];
	var _SOUNDS = {
		kill:  attachments["kill.snd"],
		spawn: attachments["spawn.snd"]
	};



	/*
	 * HELPERS
	 */

	var _explode = function(position) {

		var objects = this.queryLayer('game', 'objects');
		if (objects !== null) {

			if (objects.effects.length === 0) {

				objects.addEffect(new lychee.effect.Shake({
					duration: 300,
					shake:    {
						x: Math.random() > 0.5 ? -16 : 16,
						y: Math.random() > 0.5 ? -16 : 16
					}
				}));

			}

			objects.addEffect(new game.effect.Explosion({
				duration: 500,
				position: {
					x: position.x,
					y: position.y
				}
			}));

		}

	};

	var _respawn = function(tank) {

		var objects = this.queryLayer('game', 'objects');
		if (objects.entities.indexOf(tank) !== -1) {

console.log('RESPAWN');

		}

	};

	var _spawn = function(tank) {

		var objects = this.queryLayer('game', 'objects');
		if (objects.entities.indexOf(tank) === -1) {

			tank.removeEffects();
			tank.addEffect(new lychee.effect.Lightning({
				type:     lychee.effect.Lightning.TYPE.easeout,
				duration: 3000,
				position: {
					x: this.__origin.x,
					y: this.__origin.y
				}
			}));


			objects.addEntity(tank);
			_SOUNDS.spawn.play();

		}

		if (this.__players.indexOf(tank) === -1) {
			this.__players.push(tank);
		}

	};

	var _kill = function(tank) {

		var objects = this.queryLayer('game', 'objects');
		if (objects.entities.indexOf(tank) !== -1) {

			tank.removeEffects();

			objects.removeEntity(tank);
			_SOUNDS.kill.play();

		}

		var index = this.__players.indexOf(tank);
		if (index !== -1) {
			this.__players.splice(index, 1);
		}

	};

	var _on_init = function(data) {

		var control = this.queryLayer('ui', 'control');
		var timeout = this.queryLayer('ui', 'timeout');

		if (control !== null && timeout !== null) {

			for (var p = 0, pl = data.players.length; p < pl; p++) {

				var tank = this.__players[p] || null;
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
		var result = false;
		var tid    = data.tid;

		if (tid !== null) {
			player = this.__players[tid] || null;
		}


		if (data.positions !== undefined) {

			for (var p = 0, pl = data.positions.length; p < pl; p++) {

				var pos   = data.positions[p] || null;
				var other = this.__players[p] || null;
				if (pos !== null && other !== null) {

					if (pos.x !== -1 && pos.y !== -1) {
						other.removeEffects();
						other.position.x = data.positions[p].x;
						other.position.y = data.positions[p].y;
					}

				}

			}

		}


		if (player !== null) {

			if (player.visible === false) {
				return false;
			}


			var bullets  = this.queryLayer('game', 'bullets');
			var objects  = this.queryLayer('game', 'objects');
			var entity   = null;
			var position = {
				x: player.position.x,
				y: player.position.y
			};

			var velocity = {
				x: 0,
				y: 0
			};


			if (data.action === 'move') {

				if (data.direction === 'top')    position.y -= player.height;
				if (data.direction === 'right')  position.x += player.width;
				if (data.direction === 'bottom') position.y += player.height;
				if (data.direction === 'left')   position.x -= player.width;


				entity = objects.getEntity(null, position);

				if (entity === null || entity instanceof game.app.sprite.Item) {
					result = player.move(data.direction);
				} else {
					player.setDirection(data.direction);
				}


			} else if (data.action === 'shoot') {

				result = player.shoot();

				if (result === true) {

					data.direction = player.direction;


					if (player.direction === 'top') {
						position.y -= player.height / 2;
						velocity.y -= player.height * 5;
					}

					if (player.direction === 'right') {
						position.x += player.width / 2;
						velocity.x += player.width * 5;
					}

					if (player.direction === 'bottom') {
						position.y += player.height / 2;
						velocity.y += player.height * 5;
					}

					if (player.direction === 'left') {
						position.x -= player.width / 2;
						velocity.x -= player.width * 5;
					}


					entity = new game.app.sprite.Bullet({
						position: position,
						velocity: velocity
					});

					this.__bullets[data.tid || 0].push(entity);
					bullets.addEntity(entity);

				}

			}

		}


		return result;

	};

	var _on_update = function(data) {

		if (data.players === undefined) return;


		var control = this.queryLayer('ui', 'control');
		var timeout = this.queryLayer('ui', 'timeout');


		if (timeout !== null) {
			timeout.setTimeout(data.timeout);
		}


		if (this.__players.length < data.players.length) {

			for (var p = 0, pl = data.players.length; p < pl; p++) {

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

	var _on_start = function(data) {

		var control = this.queryLayer('ui', 'control');
		var timeout = this.queryLayer('ui', 'timeout');

		if (control !== null && timeout !== null) {

			control.setVisible(true);
			timeout.setVisible(false);

			this.__focus = control;

		}


console.log('START', data.sid, this.__players.map(function(tank) {
	return tank.id;
}));

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.app.State.call(this, main);


		this.__bullets = [[], [], [], []];
		this.__items   = [];
		this.__tanks   = [];
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

		},

		update: function(clock, delta) {

			var bullets = this.queryLayer('game', 'bullets');
			var objects = this.queryLayer('game', 'objects');

			if (bullets !== null && objects !== null) {

				var entities = objects.entities;
				var players  = this.__players;


				for (var p = 0, pl = players.length; p < pl; p++) {

					var player = players[p];

					for (var e = 0, el = entities.length; e < el; e++) {

						var entity = entities[e];
						if (entity === player) continue;

						if (entity.collidesWith(player)) {

							if (entity instanceof game.app.sprite.Item) {

								player.powerup();

								entities.splice(e, 1);
								el--;
								e--;

							}

						}

					}

				}


				for (var p = 0, pl = players.length; p < pl; p++) {

					var player = players[p];

					for (var b = 0, bl = this.__bullets[p].length; b < bl; b++) {

						var bullet = this.__bullets[p][b];
						var entity = objects.getEntity(null, bullet.position);
						if (entity !== null && entity !== player) {

							if (entity instanceof game.app.sprite.Tank) {
								entity.hit();
							}


							_explode.call(this, bullet.position);

							this.__bullets[p].splice(b, 1);
							bullets.removeEntity(bullet);
							bl--;
							b--;

						}

					}


					if (player.life <= 0) {

						_respawn.call(this, player);

					}

				}

			}


			lychee.app.State.prototype.update.call(this, clock, delta);

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


						var control = this.queryLayer('ui', 'control');
						if (control !== null) {

							control.bind('change', function(data) {

								data.tid      = this.__players.indexOf(this.__player);
								data.position = {
									x: this.__player.position.x,
									y: this.__player.position.y
								};


								var result = _on_control.call(this, data);
								if (result === true) {
									service.control(data);
								}

							}, this);

						}

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

					service.unbind('init',      _on_init,    this);
					service.unbind('update',    _on_update,  this);
					service.unbind('start',     _on_start,   this);
					service.unbind('multicast', _on_control, this);

				}

			}


			lychee.app.State.prototype.leave.call(this, oncomplete);

		}

	};


	return Class;

});

