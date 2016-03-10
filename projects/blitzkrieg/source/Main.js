
lychee.define('game.Main').requires([
	'game.Logic',
	'game.net.Client',
	'game.net.Server',
	'game.state.Game'
]).includes([
	'lychee.app.Main'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({

			title: 'Blitzkrieg',

			// Is configured in lychee.pkg
			// client: '/api/Server?identifier=/projects/blitzkrieg',

			input: {
				delay:       0,
				key:         false,
				keymodifier: false,
				touch:       true,
				swipe:       true
			},

			jukebox: {
				music: true,
				sound: true
			},

			renderer: {
				id:     'blitzkrieg',
				width:  null,
				height: null
			},

			viewport: {
				fullscreen: false
			}

		}, data);


		lychee.app.Main.call(this, settings);


		this.TILE = {
			width:  65,
			height: 90,
			offset: 90 - 36
		};



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {

			this.settings.gameclient = this.settings.client;
			this.settings.client     = null;

			this.settings.gameserver = this.settings.server;
			this.settings.server     = null;

			oncomplete(true);

		}, this, true);

		this.bind('init', function() {

			var gameclient = this.settings.gameclient || null;
			if (gameclient !== null) {

				this.client = new game.net.Client(gameclient, this);
				this.client.bind('connect', function() {
					this.changeState('game');
				}, this);

			}

			var gameserver = this.settings.gameserver || null;
			if (gameserver !== null) {
				this.server = new game.net.Server(gameserver, this);
			}


			this.logic = new game.Logic(this);

			this.setState('game', new game.state.Game(this));

		}, this, true);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.app.Main.prototype.serialize.call(this);
			data['constructor'] = 'game.Main';

			var settings = data['arguments'][0] || {};
			var blob     = data['blob'] || {};


			if (this.defaults.client !== null) { settings.client = this.defaults.client; }


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		}

	};


	return Class;

});
