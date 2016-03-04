
lychee.define('app.ui.Status').includes([
	'lychee.ui.Label'
]).exports(function(lychee, app, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);

		lychee.ui.Label.call(this, settings);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.Label.prototype.serialize.call(this);
			data['constructor'] = 'app.ui.Status';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setValue: function(value) {

			value = typeof value === 'string' ? value : null;


			if (value !== null) {

				if (value === 'Online') {

					this.alpha = 1.0;
					this.value = value;

					return true;

				} else if (value === 'Offline') {

					this.alpha = 0.25;
					this.value = value;

					return true;

				}

			}


			return false;

		}

	};


	return Class;

});

