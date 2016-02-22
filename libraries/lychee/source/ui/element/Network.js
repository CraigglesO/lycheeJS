
lychee.define('lychee.ui.element.Network').requires([
	'lychee.ui.Label',
	'lychee.ui.Input'
]).includes([
	'lychee.ui.Element'
]).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _read = function() {

		var main = global.MAIN || null;
		if (main !== null) {

			var client = main.defaults.client;
			var server = main.defaults.server;


			if (typeof client === 'string') {

				this.getEntity('API').setValue(client);
				this.getEntity('connection').setValue('dynamic');

			} else if (client instanceof Object) {

				this.getEntity('host').setValue(client.host);
				this.getEntity('port').setValue(client.port);
				this.getEntity('connection').setValue('static');

			}


			if (typeof server === 'string') {

				this.getEntity('API').setValue(server);
				this.getEntity('connection').setValue('dynamic');

			} else if (server instanceof Object) {

				this.getEntity('host').setValue(server.host);
				this.getEntity('port').setValue(server.port);
				this.getEntity('connection').setValue('static');

			}

		}

	};

	var _write = function() {

		var main = global.MAIN || null;
		if (main !== null) {

			var client = main.client || null;
			var server = main.server || null;


			var connection = this.getEntity('connection').value;
			if (connection === 'dynamic') {

				if (client !== null) {
// TODO: Dynamic configuration
				}

				if (server !== null) {
// TODO: Dynamic configuration
				}

			} else if (connection === 'static') {


				if (client !== null) {

					client.disconnect();
					client.setHost(this.getEntity('host').value);
					client.setPort(this.getEntity('port').value);
					client.connect();

				}

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		settings.label  = 'Network';
		settings.action = 'Save';


		lychee.ui.Element.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.setEntity('connection', new lychee.ui.Select({
			options: [ 'dynamic', 'static' ],
			value:   [ 'dynamic' ]
		}));

		this.setEntity('host', new lychee.ui.Input({
			type:  lychee.ui.Input.TYPE.text,
			min:   1,
			max:   1024,
			value: 'localhost'
		}));

		this.setEntity('port', new lychee.ui.Input({
			type:  lychee.ui.Input.TYPE.number,
			min:   1024,
			max:   65534,
			value: 1337
		}));

		this.setEntity('API', new lychee.ui.Input({
			type:  lychee.ui.Input.TYPE.text,
			value: '/api/Server?identifier=boilerplate'
		}));

		this.getEntity('connection').bind('change', function(value) {

			if (value === 'dynamic') {

				this.getEntity('host').visible = false;
				this.getEntity('port').visible = false;
				this.getEntity('API').visible  = true;

			} else if (value === 'static') {

				this.getEntity('host').visible = true;
				this.getEntity('port').visible = true;
				this.getEntity('API').visible  = false;

			}


			this.trigger('relayout', []);

		}, this);

		this.bind('change', function(action) {

			if (action === 'save') {
				_write.call(this);
			}

		}, this);


		this.getEntity('host').visible = false;
		this.getEntity('port').visible = false;


		_read.call(this);

		settings = null;

	};


	Class.prototype = {

	};


	return Class;

});

