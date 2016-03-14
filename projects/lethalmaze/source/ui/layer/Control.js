
lychee.define('game.ui.layer.Control').requires([
	'game.app.sprite.Tank'
]).includes([
	'lychee.ui.Layer'
]).exports(function(lychee, game, global, attachments) {



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.relayout = false;


		lychee.ui.Layer.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.unbind('relayout');
		this.bind('relayout', function() {


// TODO: Move @joystick and @buttons-fire and @buttons-mine around

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.Layer.prototype.serialize.call(this);
			data['constructor'] = 'game.ui.layer.Control';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setTank: function(tank) {

console.log('setting tank to control', tank);

		}

	};


	return Class;

});

