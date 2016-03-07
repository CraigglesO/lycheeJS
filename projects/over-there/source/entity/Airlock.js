
lychee.define('app.entity.Airlock').includes([
	'lychee.app.Sprite'
]).exports(function(lychee, app, global, attachments) {

	var _config  = attachments["json"].buffer;
	var _texture = attachments["png"];



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.texture = _texture;
		settings.width   = 0;
		settings.height  = 0;
		settings.map     = _config.map;
		settings.state   = settings.state || 'horizontal-big';
		settings.states  = _config.states;


		lychee.app.Sprite.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.app.Sprite.prototype.serialize.call(this);
			data['constructor'] = 'app.entity.Airlock';


			return data;

		}

	};


	return Class;

});

