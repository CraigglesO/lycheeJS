
lychee.define('lychee.ui.element.Stash').requires([
	'lychee.Stash',
	'lychee.ui.Label',
	'lychee.ui.Input'
]).includes([
	'lychee.ui.Element'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _clear = function() {

		var main = global.MAIN || null;
		if (main !== null) {

			var stash = main.stash || null;
			if (stash !== null) {

				var data = lychee.serialize(stash);
				if (data !== null) {

					var blob = data.blob || null;
					if (blob !== null) {
						delete data.blob;
					}

					main.stash = lychee.deserialize(data);

				}

			}

		}

	};

	var _read = function() {

		var main = global.MAIN || null;
		if (main !== null) {

			var stash = main.stash || null;
			if (stash !== null) {

				var id   = stash.id;
				var type = stash.type;


				this.getEntity('id').setValue(id);

				if (type === lychee.Stash.TYPE.persistent) {
					this.getEntity('mode').setValue('persistent');
				} else if (type === lychee.Stash.TYPE.temporary) {
					this.getEntity('mode').setValue('temporary');
				}

			}

		}

	};

	var _save = function() {

		var main = global.MAIN || null;
		if (main !== null) {

			var stash = main.stash || null;
			if (stash !== null) {

				var id   = this.getEntity('id').value;
				var mode = this.getEntity('mode').value;


				stash.setId(id);

				if (mode === 'persistent') {
					stash.setType(lychee.Stash.TYPE.persistent);
				} else if (mode === 'temporary') {
					stash.setType(lychee.Stash.TYPE.temporary);
				}

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.label   = 'Stash';
		settings.options = [ 'Clear', 'Save' ];


		lychee.ui.Element.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.setEntity('mode', new lychee.ui.Select({
			options: [ 'persistent', 'temporary' ],
			value:   'persistent'
		}));

		this.setEntity('id', new lychee.ui.Input({
			type:  lychee.ui.Input.TYPE.text,
			value: 'app'
		}));

		this.bind('change', function(action) {

			if (action === 'clear') {
				_clear.call(this);
			} else if (action === 'save') {
				_save.call(this);
			}

		}, this);


		_read.call(this);

		settings = null;

	};


	Class.prototype = {

	};


	return Class;

});

