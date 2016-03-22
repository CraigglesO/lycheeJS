
lychee.define('app.state.Welcome').includes([
	'lychee.ui.State'
]).requires([
	'lychee.ui.Blueprint',
	'lychee.ui.Element',
	'lychee.ui.Layer',
	'lychee.ui.entity.Text'
]).exports(function(lychee, app, global, attachments) {

	var _BLOB = attachments["json"].buffer;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.ui.State.call(this, main);


		this.deserialize(_BLOB);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Welcome';


			return data;

		},

		deserialize: function(blob) {

			lychee.ui.State.prototype.deserialize.call(this, blob);


			this.queryLayer('ui', 'menu').setHelpers([
				'refresh'
			]);


			this.queryLayer('ui', 'welcome > dialog').bind('change', function(value) {

				var menu = this.queryLayer('ui', 'menu');
				if (menu !== null) {

					menu.setValue(value);
					menu.trigger('change', [ value ]);

				}

			}, this);

		}

	};


	return Class;

});
