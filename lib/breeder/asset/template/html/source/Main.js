
lychee.define('app.Main').requires([
	'lychee.data.JSON',
	'app.state.Welcome',
	'app.state.Settings'
]).exports(function(lychee, app, global, attachments) {

	var _JSON   = lychee.data.JSON;
	var _config = attachments["json"].buffer;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, _config, data);


		lychee.app.Main.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {
			oncomplete(true);
		}, this, true);

		this.bind('init', function() {

			this.setState('welcome',  new app.state.Welcome(this));
			this.setState('settings', new app.state.Settings(this));


			ui.changeState('welcome');

		}, this, true);

	};


	Class.prototype = {

	};


	return Class;

});

