
lychee.define('Stash').tags({
	platform: 'node'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	var fs = require('fs');
	if (typeof fs.unlinkSync === 'function' && typeof fs.writeFileSync === 'function') {
		return true;
	}

	return false;

}).exports(function(lychee, global, attachments) {

	var _ROOT      = lychee.ROOT.project;
	var _TEMPORARY = {};



	/*
	 * FEATURE DETECTION
	 */

	var _write_persistent  = function(id, asset) { return false; };
	var _remove_persistent = function(id) {        return false; };

	(function() {

		var _fs = require('fs');


		var write = 'writeFileSync' in _fs;
		if (write === true) {

			_write_persistent = function(id, asset) {

				var result = false;
				var path   = lychee.environment.resolve(id);

				if (path.substr(0, _ROOT.length) === _ROOT) {

					var binary = [ 'Music',  'Sound', 'Texture' ];
					var utf8   = [ 'Config', 'Font',  'Stuff'   ];
					var data   = lychee.serialize(asset);

					if (data !== null && data.blob !== null && typeof data.blob.buffer === 'string') {

						var encoding = 'utf8';
						if (binary.indexOf(data.constructor) !== -1) {
							encoding = 'binary';
						} else if (utf8.indexOf(data.constructor) !== -1) {
							encoding = 'utf8';
						}

						var index = data.blob.buffer.indexOf('base64,') + 7;
						if (index > 7) {

							var buffer = new Buffer(data.blob.buffer.substr(index, data.blob.buffer.length - index), 'base64');

							try {
								_fs.writeFileSync(path, buffer, encoding);
							} catch(e) {
								result = false;
							}

						}

					}

				}


				return result;

			};

		}


		var remove = 'unlinkSync' in _fs;
		if (remove === true) {

			_remove_persistent = function(id) {

				var result = false;
				try {
					_fs.unlinkSync(path);
					result = true;
				} catch(e) {
					result = false;
				}


				return result;

			};

		}


		if (lychee.debug === true) {

			var methods = [];

			if (write && remove) methods.push('Persistent');
			if (_TEMPORARY)      methods.push('Temporary');


			if (methods.length === 0) {
				console.error('lychee.Stash: Supported methods are NONE');
			} else {
				console.info('lychee.Stash: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * HELPERS
	 */

	var _is_asset = function(asset) {

		if (asset instanceof Object && typeof asset.serialize === 'function') {
			return true;
		}

		return false;

	};

	var _read_stash = function() {

		for (var id in this.__operations) {

			var asset      = _TEMPORARY[id];
			var operations = [].slice.call(this.__operations[id]);
			if (operations.length > 0) {

				while (operations.length > 0) {

					var operation = operations.shift();
					if (operation.type === 'update') {

						if (asset === undefined) {
							asset = _TEMPORARY[id] = new lychee.Asset(id, true);
						}

						if (asset !== null) {

							asset.deserialize({
								buffer: operation.buffer
							});

						}

					} else if (operation.type === 'remove') {

						if (asset !== undefined) {

							delete _TEMPORARY[id];
							asset = undefined;

						}

					}

				}

			}

		}


		for (var id in this.__operations) {
			delete this.__operations[id];
		}

	};

	var _write_stash = function() {

		for (var id in this.__operations) {

			var asset      = _TEMPORARY[id];
			var operations = [].slice.call(this.__operations[id]);
			if (operations.length > 0) {

				while (operations.length > 0) {

					var operation = operations.shift();
					if (operation.type === 'update') {

						if (asset === undefined) {
							asset = _TEMPORARY[id] = new lychee.Asset(id, true);
						}

						if (asset !== null) {

							asset.deserialize({
								buffer: operation.buffer
							});

						}

					} else if (operation.type === 'remove') {

						if (asset !== undefined) {

							delete _TEMPORARY[id];
							asset = undefined;

						}

					}

				}


				var type = this.type;
				if (type === Class.TYPE.persistent) {

					if (_TEMPORARY[id] !== undefined) {
						_write_persistent(id, asset);
					} else {
						_remove_persistent(id);
					}

				}

			}

		}


		for (var id in this.__operations) {
			delete this.__operations[id];
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var _id = 0;

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.id   = 'lychee-Stash-' + _id++;
		this.type = Class.TYPE.persistent;


		this.__operations = {};


		this.setId(settings.id);
		this.setType(settings.type);


		lychee.event.Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		_read_stash.call(this);

	};


	Class.TYPE = {
		persistent: 0,
		temporary:  1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		sync: function(force) {

			force = force === true;


			var result = _read_stash.call(this);
			if (result === true) {

				return true;

			} else {

				if (force === true) {

					this.trigger('sync', [ this.__operations ]);

					return true;

				}

			}


			return false;

		},

		deserialize: function(blob) {

			if (blob.operations instanceof Object) {

				this.__operations = {};

				for (var id in blob.operations) {

					var operations = blob.operations[id];
					if (operations instanceof Array) {

						this.__operations[id] = operations.map(function(operation) {
							return operation;
						});

					}

				}


				_read_stash.call(this);

			}

		},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Stash';

			var settings = {};
			var blob     = (data['blob'] || {});


			if (this.id.substr(0, 13) !== 'lychee-Stash-') settings.id   = this.id;
			if (this.type !== Class.TYPE.persistent)       settings.type = this.type;


			if (Object.keys(this.__operations).length > 0) {

				blob.operations = {};

				for (var id in this.__operations) {

					var operations = this.__operations[id];
					if (operations instanceof Array) {

						blob.operations[id] = operations.map(function(operation) {
							return operation;
						});

					}

				}

			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		read: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				var asset = null;
				var cache = _TEMPORARY[id];
				if (cache !== undefined) {
					asset = lychee.deserialize(lychee.serialize(cache));
				} else {
					asset = new lychee.Asset(id, true);
				}


				return asset;

			}


			return null;

		},

		remove: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				var asset = new lychee.Asset(id, true);
				if (asset !== null && asset.buffer !== null) {

					var operations = this.__operations[id] || null;
					if (operations === null) {
						operations = this.__operations[id] = [];
					}


					operations.push({
						type:   'remove',
						id:     id,
						buffer: null
					});


					_write_stash.call(this);

					return true;

				}

			}


			return false;

		},

		write: function(id, asset) {

			id    = typeof id === 'string'    ? id    : null;
			asset = _is_asset(asset) === true ? asset : null;


			if (id !== null && asset !== null) {

				var operations = this.__operations[id] || null;
				if (operations === null) {
					operations = this.__operations[id] = [];
				}


				var buffer = null;
				var blob   = asset.serialize().blob;
				if (blob !== null && blob.buffer !== null) {
					buffer = blob.buffer;
				}

				var cache = _TEMPORARY[id];
				if (cache === undefined) {
					cache = _TEMPORARY[id] = asset;
				}


				operations.push({
					type:   'update',
					id:     id,
					buffer: buffer
				});


				_write_stash.call(this);


				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Class.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		}

	};


	return Class;

});

