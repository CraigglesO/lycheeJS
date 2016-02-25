
lychee.define('lychee.ui.element.Jukebox').requires([
	'lychee.app.Jukebox',
	'lychee.ui.Label',
	'lychee.ui.Slider',
	'lychee.ui.Switch'
]).includes([
	'lychee.ui.Element'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _read = function() {

		var main = global.MAIN || null;
		if (main !== null) {

			var jukebox = main.jukebox || null;
			if (jukebox !== null) {

				var channels = jukebox.channels;
				var music    = jukebox.music;
				var sound    = jukebox.sound;


				this.getEntity('channels').setValue(channels);
				this.getEntity('music').setValue(music === true ? 'on' : 'off');
				this.getEntity('sound').setValue(sound === true ? 'on' : 'off');

			}

		}

	};

	var _save = function() {

		var main = global.MAIN || null;
		if (main !== null) {

			var jukebox = main.jukebox || null;
			if (jukebox !== null) {

				var channels = this.getEntity('channels').value;
				var music    = this.getEntity('music').value;
				var sound    = this.getEntity('sound').value;


				jukebox.setChannels(channels);
				jukebox.setMusic(music === 'on' ? true : false);
				jukebox.setSound(sound === 'on' ? true : false);

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.label   = 'Jukebox';
		settings.options = [ 'Save' ];


		lychee.ui.Element.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.setEntity('music', new lychee.ui.Switch({
			value: 'on'
		}));

		this.setEntity('sound', new lychee.ui.Switch({
			value: 'on'
		}));

		this.setEntity('channels', new lychee.ui.Slider({
			min:   0,
			max:   16,
			step:  1,
			type:  lychee.ui.Slider.TYPE.horizontal,
			value: 8
		}));

		this.bind('change', function(action) {

			if (action === 'save') {
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

