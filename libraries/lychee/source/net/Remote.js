
lychee.define('lychee.net.Remote').requires([
	'lychee.net.remote.Debugger',
	'lychee.net.remote.Stash',
	'lychee.net.remote.Storage'
]).includes([
	'lychee.net.Tunnel'
]).exports(function(lychee, global, attachments) {

	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		lychee.net.Tunnel.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		if (lychee.debug === true) {

			this.bind('connect', function() {
				this.addService(new lychee.net.remote.Debugger(this));
			}, this);

		}


		this.bind('connect', function() {

			this.addService(new lychee.net.remote.Stash(this));
			this.addService(new lychee.net.remote.Storage(this));

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.net.Tunnel.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Remote';


			return data;

		}

	};


	return Class;

});

