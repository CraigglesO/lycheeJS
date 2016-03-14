
lychee.define('game.state.Game').requires([
	'lychee.app.Layer',
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
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.app.State.call(this, main);


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

				this.queryLayer('game', 'terrain').setEntities(level.terrain);
				this.queryLayer('game', 'objects').setEntities(level.objects);


				var client = this.client;
				if (client !== null) {

					var service = client.getService('control');
					if (service !== null) {

						service.bind('init', function(data) {

							console.log('SERVICE INIT', data.tid, data);


							var control = this.queryLayer('ui', 'control');
							var timeout = this.queryLayer('ui', 'timeout');

							if (control !== null && timeout !== null) {

								timeout.setVisible(true);
								control.setVisible(false);
								control.setTank(this.__tanks[data.tid] || null);


								timeout.setTimeout(data.timeout);
								timeout.bind('init', function() {

									this.jukebox.setVolume(0.5);

									control.setVisible(true);
									timeout.setVisible(false);

								}, this, true);

							}

						}, this);

					}

				}


				this.queryLayer('ui', 'control').setVisible(false);
				this.queryLayer('ui', 'timeout').setVisible(true);


				this.__tanks = level.objects.filter(function(obj) {
					return obj instanceof game.app.sprite.Tank;
				});

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


			lychee.app.State.prototype.leave.call(this, oncomplete);

		}

	};


	return Class;

});

