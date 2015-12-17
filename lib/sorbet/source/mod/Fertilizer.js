
lychee.define('sorbet.mod.Fertilizer').tags({
	platform: 'node'
}).requires([
	'sorbet.data.Filesystem'
]).supports(function(lychee, global) {

	try {

		require('child_process');

		return true;

	} catch(e) {

	}


	return false;

}).exports(function(lychee, sorbet, global, attachments) {

	var _child_process = require('child_process');
	var _root          = new sorbet.data.Filesystem().root;



	/*
	 * HELPERS
	 */

	var _fertilize = function(project, identifier) {

		_child_process.fork(_root + '/bin/fertilizer.js', [
			project,
			identifier
		], {
			cwd: _root
		}).on('exit', function(code) {

			if (code === 1) {

				console.error('sorbet.mod.Fertilizer: FAILURE ("' + project + ' | ' + identifier + '")');

			} else {

				console.info('sorbet.mod.Fertilizer: SUCCESS ("' + project + ' | ' + identifier + '")');

			}

		});

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'sorbet.mod.Fertilizer',
				'arguments': []
			};

		},



		/*
		 * CUSTOM API
		 */

		can: function(project) {

			if (project.package !== null) {

				var build = project.package.json.build || null;
				if (build !== null) {

					var environments = build.environments || null;
					if (environments !== null) {

						var identifiers = Object.keys(environments);
						if (identifiers.length > 0) {
							return true;
						}

					}

				}

			}


			return false;

		},

		process: function(project) {

			if (project.filesystem !== null && project.package !== null) {

				var build = project.package.json.build || null;
				if (build !== null) {

					var environments = build.environments || null;
					if (environments !== null) {

						var identifiers = Object.keys(environments);
						if (identifiers.length > 0) {

							var root = project.filesystem.root.substr(_root.length);

							identifiers.forEach(function(identifier) {
								_fertilize(root, identifier);
							});

						}

					}

				}

			}

		}

	};


	return Module;

});

