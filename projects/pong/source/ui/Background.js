
lychee.define('game.ui.Background').includes([
	'lychee.ui.sprite.Background'
]).exports(function(lychee, game, global, attachments) {

	var _texture = attachments["png"];
	var _config  = attachments["json"].buffer;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.color   = '#050a0d';
		settings.texture = _texture;
		settings.map     = _config.map;
		settings.states  = _config.states;
		settings.state   = 'default';


		lychee.ui.sprite.Background.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.sprite.Background.prototype.serialize.call(this);
			data['constructor'] = 'game.ui.Background';


			return data;

		}

	};


	return Class;

});

