
lychee.define('game.ui.entity.Timeout').requires([
	'lychee.effect.Shake'
]).includes([
	'lychee.ui.Entity'
]).exports(function(lychee, game, global, attachments) {

	var _FONT = attachments["fnt"];



	var Class = function(data) {

		var settings = lychee.extend({}, data);


console.log('TIMEOUT entity creation', settings);


		lychee.ui.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		setTimeout: function(timeout) {

console.log('set timeout nao', timeout);

		},

		setVisible: function(visible) {

			if (visible === true) {


				return true;

			} else if (visible === false) {


				return true;

			}


			return false;

		}

	};


	return Class;

});

