#!/usr/bin/env node

(function() {

	var _CORE      = '';
	var _BOOTSTRAP = {};


	(function() {

		if (typeof String.prototype.trim !== 'function') {

			String.prototype.trim = function() {
				return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
			};

		}

		if (typeof Object.values !== 'function') {

			Object.values = function(object) {

				if (object !== Object(object)) {
					throw new TypeError('Object.values called on a non-object');
				}


				var values = [];

				for (var prop in object) {

					if (Object.prototype.hasOwnProperty.call(object, prop)) {
						values.push(object[prop]);
					}

				}

				return values;

			};

		}

	})();



	var _fs      = require('fs');
	var _package = null;
	var _path    = require('path');
	var _root    = _path.resolve(process.cwd(), '.');



	/*
	 * HELPERS
	 */

	var _is_directory = function(path) {

		try {
			var stat = _fs.lstatSync(path);
			return stat.isDirectory();
		} catch(e) {
			return false;
		}

	};

	var _is_file = function(path) {

		try {
			var stat = _fs.lstatSync(path);
			return stat.isFile();
		} catch(e) {
			return false;
		}

	};

	var _create_directory = function(path, mode) {

		if (mode === undefined) {
			mode = 0777 & (~process.umask());
		}


		var is_directory = false;

		try {

			is_directory = _fs.lstatSync(path).isDirectory();

		} catch(err) {

			if (err.code === 'ENOENT') {

				if (_create_directory(_path.dirname(path), mode) === true) {
					_fs.mkdirSync(path, mode);
				}

				try {
					is_directory = _fs.lstatSync(path).isDirectory();
				} catch(err) {
				}

			}

		} finally {

			return is_directory;

		}

	};

	var _remove_directory = function(path) {

		path = _path.resolve(path);


		if (_is_directory(path) === true) {

			_fs.readdirSync(path).forEach(function(file) {

				if (_is_directory(path + '/' + file) === true) {
					_remove_directory(path + '/' + file);
				} else {
					_fs.unlinkSync(path + '/' + file);
				}

			});

			_fs.rmdirSync(path);

		}

	};

	var _get_projects = function(path) {

		var projects      = [];
		var projects_root = _path.resolve(_root, path);

		if (_is_directory(projects_root) === true) {

			projects = _fs.readdirSync(projects_root).filter(function(file) {
				return _is_directory(projects_root + '/' + file) === true;
			}).map(function(file) {
				return path + '/' + file;
			});

		}

		return projects;

	};

	var _walk_directory = function(files, node, path) {

		if (node instanceof Array) {

			if (node.indexOf('js') !== -1) {
				files.push(path + '.js');
			}

		} else if (node instanceof Object) {

			Object.keys(node).forEach(function(child) {
				_walk_directory(files, node[child], path + '/' + child);
			});

		}

	};

	var _package_definitions = function(json) {

		var files = [];

		if (json !== null) {

			var root = json.source.files || null;
			if (root !== null) {
				_walk_directory(files, root, '');
			}

		}


		return files.map(function(value) {
			return value.substr(1);
		}).filter(function(value) {
			return value.substr(0, 4) !== 'core' && value.substr(0, 8) !== 'platform';
		}).map(function(value) {
			return 'lychee.' + value.split('.')[0].split('/').join('.');
		}).filter(function(value) {
			return value.indexOf('__') === -1;
		});

	};

	var _package_files = function(json) {

		var files = [];

		if (json !== null) {

			var root = json.source.files || null;
			if (root !== null) {
				_walk_directory(files, root, '');
			}

		}


		return files.map(function(value) {
			return value.substr(1);
		}).sort(function(a, b) {
			if (a > b) return  1;
			if (a < b) return -1;
			return 0;
		});

	};



	/*
	 * 0: ENVIRONMENT CHECK
	 */

	(function(libraries, projects) {

		var errors = 0;

		console.log('> Checking Environment');


		if (_is_directory(_path.resolve(_root, './lib/lychee')) === true) {
			console.log('\tprocess cwd: OKAY');
		} else {
			console.log('\tprocess cwd: FAIL (' + _root + ' is not the lycheeJS directory)');
			errors++;
		}


		var data = null;

		if (_is_file(_path.resolve(_root, './lib/lychee/lychee.pkg')) === true) {

			try {
				data = JSON.parse(_fs.readFileSync(_path.resolve(_root, './lib/lychee/lychee.pkg')));
			} catch(e) {
				data = null;
			}

		}


		if (data !== null) {
			_package = data;
			console.log('\t./lib/lychee/lychee.pkg: OKAY');
		} else {
			console.log('\t./lib/lychee/lychee.pkg: FAIL (Invalid JSON)');
			errors++;
		}



		if (errors === 0) {
			console.log('> OKAY\n');
		} else {
			console.log('> FAIL\n');
			process.exit(1);
		}


		console.log('> Cleaning lycheeJS builds');

		libraries.forEach(function(path) {

			if (_is_directory(_path.resolve(_root, path + '/build'))) {

				_remove_directory(_path.resolve(_root, path + '/build'));

				console.log('\t' + path + '/build: OKAY');

			} else {

				console.log('~\t' + path + '/build: SKIP');

			}

		});

		projects.forEach(function(path) {

			if (_is_directory(_path.resolve(_root, path + '/build'))) {

				_remove_directory(_path.resolve(_root, path + '/build'));

				console.log('\t' + path + '/build: OKAY');

			} else {

				console.log('~\t' + path + '/build: SKIP');

			}

		});

		console.log('> OKAY\n');

	})(_get_projects('./lib'), _get_projects('./projects'));



	/*
	 * 1: CORE GENERATION
	 */

	(function() {

		var errors = 0;
		var files  = _package_files(_package).filter(function(value) {
			return value.substr(0, 4) === 'core';
		});

		if (files.indexOf('core/lychee.js') !== 0) {

			files.reverse();
			files.push(files.splice(files.indexOf('core/lychee.js'), 1));
			files.reverse();

		}


		console.log('> Generating lycheeJS core');


		files.forEach(function(file) {

			var path = _path.resolve(_root, './lib/lychee/source/' + file);
			if (_is_file(path) === true) {
				_CORE += _fs.readFileSync(path, 'utf8');
			} else {
				errors++;
			}

		});


		if (errors === 0) {
			console.log('> OKAY\n');
		} else {
			console.log('> FAIL\n');
			process.exit(1);
		}

	})();



	/*
	 * 2: PLATFORM GENERATION
	 */

	(function() {

		var errors    = 0;
		var files     = _package_files(_package).filter(function(value) {
			return value.substr(0, 8) === 'platform' && value.indexOf('bootstrap.js') !== -1;
		}).concat(_package_files(_package).filter(function(value) {
			return value.substr(0, 8) === 'platform' && value.indexOf('bootstrap.js') === -1;
		}).sort(function(a, b) {
			if (a > b) return  1;
			if (a < b) return -1;
			return 0;
		}));


		console.log('> Generating lycheeJS platform adapters');


		var bootstrap = {};
		var platforms = Object.keys(_package.source.tags.platform);


		platforms.forEach(function(platform) {

			var prefix = 'platform/' + platform + '/';

			bootstrap[platform] = {};

			var base = platform.indexOf('-') ? platform.split('-')[0] : null;
			if (base !== null) {

				for (var file in bootstrap[base]) {
					bootstrap[platform][file] = bootstrap[base][file];
				}

			}


			files.filter(function(value) {
				return value.substr(0, prefix.length) === prefix;
			}).map(function(value) {
				return value.substr(prefix.length);
			}).forEach(function(adapter) {

				var path = _path.resolve(_root, './lib/lychee/source/' + prefix + adapter);
				if (_is_file(path) === true) {

					if (adapter === 'bootstrap.js' && typeof bootstrap[platform]['bootstrap.js'] === 'string') {
						bootstrap[platform][adapter] += _fs.readFileSync(path, 'utf8');
					} else {
						bootstrap[platform][adapter]  = _fs.readFileSync(path, 'utf8');
					}

				}

			});

		});

		platforms.forEach(function(platform) {

			if (Object.keys(bootstrap[platform]).length === 0) {
				delete bootstrap[platform];
			} else {
				_BOOTSTRAP[platform] = Object.values(bootstrap[platform]).join('');
			}

		});


		Object.keys(_BOOTSTRAP).forEach(function(platform) {

			var result = true;
			var code   = _CORE + _BOOTSTRAP[platform];
			var path   = _path.resolve(_root, './lib/lychee/build/' + platform + '/core.js');
			var dir    = _path.dirname(path);

			if (_is_directory(dir) === false) {
				_create_directory(dir);
			}


			if (_is_directory(dir) === true) {

				try {
					_fs.writeFileSync(path, code, 'utf8');
				} catch(e) {
					result = false;
				}

			} else {
				result = false;
			}


			if (result === false) {
				console.log('\t' + platform + ': FAIL (Could not write to "' + path + '")');
				errors++;
			} else {
				console.log('\t' + platform + ': OKAY');
			}

		});


		if (errors === 0) {
			console.log('> OKAY\n');
		} else {
			console.log('> FAIL\n');
			process.exit(1);
		}

	})();



	/*
	 * 3: PLATFORM DISTRIBUTION
	 */

	(function() {

		console.log('> Distributing lycheeJS library');


		var dist = _package_definitions(_package).filter(function(value) {
			return value !== 'lychee.DIST';
		});

		var code = (function () {/*
			lychee.define('lychee.DIST').requires([{{requires}}]).exports(function(lychee, global, attachments) {

				var Class = function() {};

				Class.prototype = {

				};

				return Class;

			});

		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].split('\n').map(function(val) {
			return val.substr(3);
		}).join('\n').replace('{{requires}}', '\n\t' + dist.map(function(val) {
			return '\'' + val + '\'';
		}).join(',\n\t') + '\n');


		var result = true;
		var path   = _path.resolve(_root, './lib/lychee/source/DIST.js');
		var dir    = _path.dirname(path);

		if (_is_directory(dir) === false) {
			_create_directory(dir);
		}


		if (_is_directory(dir) === true) {

			try {
				_fs.writeFileSync(path, code, 'utf8');
			} catch(e) {
				result = false;
			}

		} else {
			result = false;
		}


		if (result === true) {
			console.log('> OKAY\n');
		} else {
			console.log('> FAIL\n');
			process.exit(1);
		}

	})();

})();

