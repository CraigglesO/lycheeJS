
lychee.define('app.state.Menu').includes([
	'lychee.app.state.Menu'
]).exports(function(lychee, app, global, attachments) {

	var _blob = attachments["json"].buffer;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.app.state.Menu.call(this, main);

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		serialize: function() {

			var data = lychee.app.state.Menu.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Menu';


			return data;

		},

		deserialize: function(blob) {

			lychee.app.state.Menu.prototype.deserialize.call(this, blob);
			lychee.app.State.prototype.deserialize.call(this, _blob);


			this.queryLayer('ui', 'welcome > dialog').bind('change', function(value) {

				if (this.main.getState(value) !== null) {
					this.main.changeState(value);
				} else if (this.queryLayer('ui', value) !== null) {
					this.queryLayer('ui', 'menu').setValue(value);
				}

			}, this);

		}

	};


	return Class;

});
