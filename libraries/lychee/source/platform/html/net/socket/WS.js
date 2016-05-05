
lychee.define('lychee.net.socket.WS').tags({
	platform: 'html'
}).requires([
	'lychee.net.protocol.WS'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.WebSocket !== 'undefined') {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	var _Protocol  = lychee.import('lychee.net.protocol.WS');
	var _WebSocket = global.WebSocket;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function() {

		this.__connection = null;

		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.socket.WS';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function(host, port, connection) {

			host       = typeof host === 'string'       ? host       : null;
			port       = typeof port === 'number'       ? (port | 0) : null;
			connection = typeof connection === 'object' ? connection : null;


			if (connection !== null) {

				// TODO: Port lychee.net.Remote code


				this.__connection = connection;

			} else {

				var that = this;
				var url  = 'ws://' + host + ':' + port;

				if (host.match(/:/g) !== null) {
					url = 'ws://[' + host + ']:' + port;
				}


				connection = new _WebSocket(url, [ 'lycheejs' ]);

				connection.onopen = function() {
					that.trigger('connect');
				};

				connection.onmessage = function(event) {
					that.trigger('receive', [ event.data ]);
				};

				connection.onclose = function() {
					that.trigger('disconnect');
				};

				connection.ontimeout = function() {
					that.trigger('error');
					this.close();
				};

				connection.onerror = function() {
					that.trigger('error');
					this.close();
				};


				if (lychee.debug === true) {
					console.log('lychee.net.socket.WS: Connected to ' + host + ':' + port);
				}


				this.__connection = connection;

			}

		},

		disconnect: function() {

			if (lychee.debug === true) {
				console.log('lychee.net.socket.WS: Disconnected');
			}


			if (this.__connection !== null) {
				this.__connection.close();
			}

		}

	};


	return Class;

});

