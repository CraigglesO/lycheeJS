
lychee.define('lychee.ui.Helper').tags({
	platform: 'html'
}).includes([
	'lychee.ui.Button'
]).supports(function(lychee, global) {

	if (typeof global.document !== 'undefined') {

		if (typeof global.document.createElement === 'function') {
			return true;
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {



	/*
	 * HELPERS
	 */

	var _is_value = function(value) {

		value = typeof value === 'string' ? value : null;


		if (value !== null) {

			var action   = value.split('=')[0] || '';
			var resource = value.split('=')[1] || '';


			if (action === 'boot' && resource !== '') {

				return true;

			} else if (action === 'unboot') {

				return true;

			} else if (action.match(/start|stop|edit|file|web/g) && resource !== '') {

				return true;

			}

		}


		return false;

	};

	var _help = function(value) {

		var element = global.document.createElement('a');

		element.href = 'lycheejs://' + value;

		element.click();


		return true;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({
			label: 'HELPER'
		}, data);


		lychee.ui.Button.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.unbind('touch');
		this.bind('touch', function() {

			var value = this.value;
			if (value !== null) {

				var result = _help(this.value);
				if (result === true) {
					this.trigger('change', [ this.value ]);
				}

			}

		}, this);

	};


	Class.prototype = {

		setValue: function(value) {

			value = _is_value(value) === true ? value : null;


			if (value !== null) {

				this.value = value;

				return true;

			}


			return false;

		}

	};


	return Class;

});

