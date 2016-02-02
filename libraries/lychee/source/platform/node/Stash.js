
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

	var __root       = lychee.Environment.__ROOT;
	var _TEMPORARY   = {};
	var _ASSET_TYPES = [
		global.Config,
		global.Font,
		global.Music,
		global.Sound,
		global.Texture,
		global.Stuff
	];



	/*
	 * FEATURE DETECTION
	 */

	var _write_persistent  = function(path, asset) { return false; };
	var _remove_persistent = function(path) {        return false; };

	(function() {

		var _fs = require('fs');

		var unlink = 'unlinkSync' in _fs;
		if (unlink === true) {

			_remove_persistent = function(path) {

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


		var write = 'writeFileSync' in _fs;
		if (write === true) {

			_write_persistent = function(path, asset) {

				var binary   = [ global.Music,  global.Sound, global.Texture ];
				var utf8     = [ global.Config, global.Font,  global.Stuff   ];
				var encoding = 'utf8';
				var result   = false;


				if (binary.indexOf(asset.constructor) !== -1) {
					encoding = 'binary';
				} else if (utf8.indexOf(asset.constructor) !== -1) {
					encoding = 'utf8';
				}


				var data = lychee.serialize(asset);
				if (data !== null && data.blob !== null && typeof data.blob.buffer === 'string') {

					var index = data.blob.buffer.indexOf('base64,') + 7;
					if (index > 7) {

						var buffer = new Buffer(data.blob.buffer.substr(index, data.blob.buffer.length - index), 'base64');

						try {
							_fs.writeFileSync(path, encoding, buffer);
						} catch(e) {
							result = false;
						}

					}

				}


				return result;

			};

		}


		if (lychee.debug === true) {

			var methods = [];

			if (unlink && write) methods.push('Persistent');
			if (_TEMPORARY)      methods.push('Temporary');


			if (methods.length === 0) {
				console.error('lychee.Stash: Supported methods are NONE');
			} else {
				console.info('lychee.Stash: Supported methods are ' + methods.join(', '));
			}

		}


console.info(lychee.Environment.__ROOT);

	})();



	/*
	 * HELPERS
	 */

	var _resolve_url = function(path) {

		var proto = path.split(':')[0] || '';

		if (__root !== '') {
			path = __root + (path.charAt(0) === '/' ? '' : '/') + path;
		}


		var tmp = path.split('/');

		for (var t = 0, tl = tmp.length; t < tl; t++) {

			if (tmp[t] === '.') {
				tmp.splice(t, 1);
				tl--;
				t--;
			} else if (tmp[t] === '..') {
				tmp.splice(t - 1, 2);
				tl -= 2;
				t -= 2;
			}

		}

		return tmp.join('/');

	};

	var _is_asset = function(asset) {

		if (asset instanceof Object) {
			return _ASSET_TYPES.indexOf(asset.constructor) !== -1;
		}


		return false;

	};

	var _read_stash = function() {

		for (var id in this.__operations) {

			var asset      = _TEMPORARY[id] || null;
			var operations = [].slice.call(this.__operations[id]);
			if (operations.length > 0) {

				while (operations.length > 0) {

					var operation = operations.shift();
					if (operation.type === 'update') {

						if (asset === null) {
							asset = _TEMPORARY[id] = new lychee.Asset(id, true);
						}

						if (asset !== null) {
							asset.buffer = operation.buffer;
						}

					} else if (operation.type === 'remove') {

						if (asset !== null) {
							_TEMPORARY[id] = null;
							asset = null;
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

			var asset      = _TEMPORARY[id] || null;
			var operations = [].slice.call(this.__operations[id]);
			if (operations.length > 0) {

				while (operations.length > 0) {

					var operation = operations.shift();
					if (operation.type === 'update') {

						if (asset !== null) {
							asset.buffer = operation.buffer;
						}

					} else if (operation.type === 'remove') {

						if (asset !== null) {
							_TEMPORARY[id] = null;
							asset = null;
						}

					}

				}


				var resolved = _resolve_url(id);
				if (resolved.substr(0, __root.length) === __root) {

					var type = this.type;
					if (type === Class.TYPE.persistent) {

						if (_is_asset(_TEMPORARY[id]) === true) {

							_write_persistent(resolved, _TEMPORARY[id]);

						} else if (_TEMPORARY[id] === null) {

							_remove_persistent(resolved);
							delete _TEMPORARY[id];

						}

					} else if (type === Class.TYPE.temporary) {

						// Do nothing, because _TEMPORARY takes over

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

							return {
								type:   operation.type,
								id:     operation.id,
								buffer: lychee.deserialize(operation.buffer)
							};

						});

					}

				}

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

							return {
								type:   operation.type,
								id:     operation.id,
								buffer: lychee.serialize(operation.buffer)
							};

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
				var cache = _TEMPORARY[id] || null;
				if (cache !== null) {
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


				operations.push({
					type:   'write',
					id:     id,
					buffer: asset.buffer
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

