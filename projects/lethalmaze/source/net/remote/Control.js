
lychee.define('game.net.remote.Control').includes([
	'lychee.net.remote.Session'
]).exports(function(lychee, game, global, attachments) {

	/*
	 * HELPERS
	 */


	var _id       = 0;
	var _sessions = {};

	var _on_plug = function() {

		var found = null;

		Object.values(_sessions).forEach(function(session) {

			if (session.active === false && session.tunnels.length < 6) {
				found = session;
			}

		});


		if (found !== null) {

			found.players.push(this.tunnel.host + ':' + this.tunnel.port);
			found.tunnels.push(this.tunnel);

		} else {

			var id = 'lethalmaze-' + _id++;


			found = _sessions[id] = {
				id:      id,
				active:  false,
				timeout: 10000,
				players: [ this.tunnel.host + ':' + this.tunnel.port ],
				tunnels: [ this.tunnel    ]
			};


			var handle = setInterval(function() {

				var timeout = this.timeout;
				if (timeout > 1000) {

					this.timeout -= 1000;


					for (var t = 0, tl = this.tunnels.length; t < tl; t++) {

						this.tunnels[t].send({
							sid:     this.id,
							tid:     t,
							players: this.players,
							timeout: this.timeout
						}, {
							id:    'control',
							event: 'update'
						});

					}

				} else {

					clearInterval(handle);

					this.active  = true;
					this.timeout = 0;


					for (var t = 0, tl = this.tunnels.length; t < tl; t++) {

						this.tunnels[t].send({
							sid:     this.id,
							tid:     t,
							players: this.players,
							timeout: this.timeout
						}, {
							id:    'control',
							event: 'start'
						});

					}

				}

			}.bind(found), 1000);

		}


		var tunnel = this.tunnel;
		if (tunnel !== null) {

			tunnel.send({
				sid:     found.id,
				tid:     found.tunnels.indexOf(tunnel),
				players: found.players,
				timeout: found.timeout
			}, {
				id:    'control',
				event: 'init'
			});

		}

	};

	var _on_unplug = function() {

		var that = this;


		_sessions = Object.filter(_sessions, function(session, key) {

			var index = session.tunnels.indexOf(that.tunnel);
			if (index !== -1) {

				session.players.splice(index, 1);
				session.tunnels.splice(index, 1);


				for (var t = 0, tl = session.tunnels.length; t < tl; t++) {

					session.tunnels[t].send({
						sid:     session.id,
						tid:     t,
						players: session.players
					}, {
						id:    'control',
						event: 'update'
					});

				}


				return true;

			}


			return false;

		});

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(remote) {

		var settings = {};


		lychee.net.remote.Session.call(this, 'control', remote, settings);


		this.bind('plug',   _on_plug,   this);
		this.bind('unplug', _on_unplug, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.net.remote.Session.prototype.serialize.call(this);
			data['constructor'] = 'app.net.remote.Control';


			return data;

		}

	};


	return Class;

});

