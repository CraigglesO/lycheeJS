
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

						var blob = null;
						var view = null;

						if (typeof event.data === 'string') {

							blob = new Buffer(event.data, 'utf8');

						} else if (event.data instanceof ArrayBuffer) {

							blob = new Buffer(event.data.byteLength);
							view = new Uint8Array(event.data);

							for (var v = 0, vl = blob.length; v < vl; v++) {
								blob[v] = view[v];
							}

						}


						if (blob !== null) {
							that.trigger('receive', [ blob ]);
						}

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

			data   = data instanceof Buffer ? data : null;
			binary = binary === true;


			if (data !== null) {

				var connection = this.__connection;
				var protocol   = this.__protocol;

				if (connection !== null && protocol !== null) {

					if (binary === true) {

						var blob = new ArrayBuffer(buffer.length);
						var view = new Uint8Array(blob);

						for (var b = 0, bl = blob.length; b < bl; b++) {
							view[b] = blob[b];
						}

						connection.send(blob);

					} else {

						connection.send(data.toString('utf8'));

					}

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

