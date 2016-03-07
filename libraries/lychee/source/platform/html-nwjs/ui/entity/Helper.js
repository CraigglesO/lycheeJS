
lychee.define('lychee.ui.entity.Helper').tags({
	platform: 'node'
}).includes([
	'lychee.ui.entity.Button'
]).supports(function(lychee, global) {

	var child_process = require('child_process');
	if (typeof child_process.execFile === 'function') {
		return true;
	}

	return false;

}).exports(function(lychee, global, attachments) {

	var _child_process = require('child_process');
	var _root          = lychee.ROOT.lychee;



	/*
	 * HELPERS
	 */

	var _is_value = function(value) {

		value = typeof value === 'string' ? value : null;


		if (value !== null) {

			var action   = value.split('=')[0] || '';
			var resource = value.split('=')[1] || '';
			var data     = value.split('=')[2] || '';


			if (action === 'boot' && resource !== '') {

				return true;

			} else if (action === 'profile' && resource !== '' && data !== '') {

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

		var helper = null;

		try {

			var helper = _child_process.execFile(_root + '/bin/helper.sh', [
				'lycheejs://' + value
			], {
				cwd: _root
			}, function(error, stdout, stderr) {

				stderr = (stderr.trim() || '').toString();


				if (error !== null && error.signal !== 'SIGTERM') {

					helper = null;

				} else if (stderr !== '') {

console.error(stderr);

				}

			});

			helper.stdout.on('data', function(lines) {

console.log('DATA', lines);

			});

			helper.on('error', function() {
				this.kill('SIGTERM');
			});

			helper.on('exit', function() {
			});

		} catch(e) {

			helper = null;

		}


		return helper !== null;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({
			label: 'HELPER'
		}, data);


		lychee.ui.entity.Button.call(this, settings);

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

