
lychee.define('fertilizer.data.Shell').tags({
	platform: 'node'
}).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {

		try {

			require('child_process');
			require('path');

			return true;

		} catch(e) {
		}

	}

	return false;

}).exports(function(lychee, global, attachments) {

	var _ROOT          = lychee.ROOT.lychee;
	var _child_process = require('child_process');
	var _path          = require('path');



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(root) {

		root = typeof root === 'string' ? root : ('' + lychee.ROOT.project);


		this.root = _ROOT + _path.normalize(root);

		this.__stack = [];

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'constructor': 'fertilizer.data.Shell',
				'arguments':   [ this.root.substr(_ROOT.length) ]
			};

		},



		/*
		 * CUSTOM API
		 */

		exec: function(command, callback, scope) {

			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			var that = this;

			if (callback !== null) {

				_child_process.exec(this.root + command, {
					cwd: this.root
				}, function(err, stdout, stderr) {

					that.__stack.push({
						cwd:    this.root,
						cmd:    this.root + command,
						stdout: stdout.toString(),
						stderr: stderr.toString()
					});


					if (err) {
						callback.call(scope, false);
					} else {
						callback.call(scope, true);
					}

				});

			} else {

				try {

					var stdout = _child_process.execSync(this.root + command, {
						cwd: this.root
					}).toString();


					that.__stack.push({
						cwd:    this.root,
						cmd:    this.root + command,
						stdout: stdout.toString(),
						stderr: null
					});


					if (stdout.match(/SUCCESS/)) {
						return true;
					} else {
						return false;
					}

				} catch(err) {

					that.__stack.push({
						cwd:    this.root,
						cmd:    this.root + command,
						stdout: err.stdout.toString(),
						stderr: err.stderr.toString()
					});


					return false;

				}

			}

		},

		trace: function(limit) {

			limit = typeof limit === 'number' ? (limit | 0) : null;


			var stack = this.__stack;
			if (limit !== null) {
				stack = stack.slice(stack.length - limit, limit);
			}


			stack.forEach(function(context) {

				console.log('');
				console.log('cd ' + context.cwd + ';');
				console.log(context.cmd + ';');
				console.log('');

				console.log(context.stdout.trim());

				if (context.stderr !== null && context.stderr.trim().length > 0) {
					console.error(context.stderr.trim());
				}

				console.log('');

			});

		}

	};


	return Class;

});

