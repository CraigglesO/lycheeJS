
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
		this.__protocol   = null;

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


			var that = this;
			var url  = 'ws://' + host + ':' + port;


			if (host !== null && port !== null) {

				if (connection !== null) {

					// TODO: Port lychee.net.Remote code


					this.__connection = connection;
					this.__protocol   = new _Protocol(_Protocol.TYPE.remote);

				} else {


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

						that.__connection = null;
						that.__protocol   = null;
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
					this.__protocol   = new _Protocol(_Protocol.TYPE.client);

				}

			}

		},

		send: function(data, binary) {

// TODO: Fix this shit here
if (typeof data === 'string') {
	data = new Buffer(data, 'utf8');
}


			data   = data instanceof Buffer ? data : null;
			binary = binary === true;


			if (data !== null) {

				var connection = this.__connection;
				var protocol   = this.__protocol;

				if (connection !== null && protocol !== null) {

					connection.send(data.toString('utf8'), binary);

					// XXX: Normally, Protocol encodes data into chunk
					// var chunk = this.__protocol.send(data, binary);
					// if (chunk !== null) {
					// 	connection.write(buffer);
					// }

				}

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

