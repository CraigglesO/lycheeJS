
lychee.define('lychee.net.remote.Debugger').includes([
	'lychee.net.Service'
]).exports(function(lychee, global, attachments) {

	var _tunnels = [];



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(remote) {

		lychee.net.Service.call(this, 'debugger', remote, lychee.net.Service.TYPE.remote);



		/*
		 * INITIALIZATION
		 */

		this.bind('plug', function() {

			_tunnels.push(this.tunnel);

		}, this);

		this.bind('unplug', function() {

			var index = _tunnels.indexOf(this.tunnel);
			if (index !== -1) {
				_tunnels.splice(index, 1);
			}

		}, this);

		this.bind('execute', function(data) {

			var sender   = null;
			var receiver = data.tid || null;

			if (this.tunnel !== null) {
				sender = this.tunnel.host + ':' + this.tunnel.port;
			}


			if (sender !== null && receiver !== null) {

				var tunnel = _tunnels.find(function(client) {
					return (client.host + ':' + client.port) === receiver;
				}) || null;

				if (tunnel !== null) {

					data.receiver = sender;

					tunnel.send(data, {
						id:    'debugger',
						event: 'execute'
					});

				}

			}

		}, this);

		this.bind('execute-value', function(data) {

			if (this.tunnel !== null) {

				var receiver = data.tid || null;
				if (receiver !== null) {

					var tunnel = _tunnels.find(function(client) {
						return (client.host + ':' + client.port) === receiver;
					}) || null;

					if (tunnel !== null) {

						tunnel.send(data, {
							id:    'debugger',
							event: 'console'
						});

					}

				}

			}

		}, this);

		this.bind('expose', function(data) {

			var sender   = null;
			var receiver = data.tid || null;

			if (this.tunnel !== null) {
				sender = this.tunnel.host + ':' + this.tunnel.port;
			}


			if (sender !== null && receiver !== null) {

				var tunnel = _tunnels.find(function(client) {
					return (client.host + ':' + client.port) === receiver;
				}) || null;

				if (tunnel !== null) {

					data.receiver = sender;

					tunnel.send(data, {
						id:    'debugger',
						event: 'expose'
					});

				}

			}

		}, this);

		this.bind('expose-value', function(data) {

			if (this.tunnel !== null) {

				var receiver = data.tid || null;
				if (receiver !== null) {

					var tunnel = _tunnels.find(function(client) {
						return (client.host + ':' + client.port) === receiver;
					}) || null;

					if (tunnel !== null) {

						tunnel.send(data, {
							id:    'debugger',
							event: 'console'
						});

					}

				}

			}

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});

