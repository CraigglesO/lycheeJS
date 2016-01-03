
lychee.define('harvester.mod.Fertilizer').tags({
	platform: 'node'
}).requires([
	'harvester.data.Filesystem'
]).supports(function(lychee, global) {

	try {

		require('child_process');

		return true;

	} catch(e) {

	}


	return false;

}).exports(function(lychee, harvester, global, attachments) {

	var _child_process = require('child_process');
	var _root          = new harvester.data.Filesystem().root;



	/*
	 * HELPERS
	 */

	var _fertilize = function(project, target) {

		// NEVER CHANGE THIS TO A JAVASCRIPT FILE
		// libuv has a serious bug and starts the js file with
		// native node interpreter, NOT this execution binary

		_child_process.execFile(_root + '/bin/fertilizer.sh', [
			target,
			project
		], {
			cwd: _root
		}, function(error, stdout, stderr) {

			if (error) {
				console.error('harvester.mod.Fertilizer: FAILURE ("' + project + ' | ' + target + '")');
			} else {
				console.info('harvester.mod.Fertilizer: SUCCESS ("' + project + ' | ' + target + '")');
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
				'reference': 'harvester.mod.Fertilizer',
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

						var targets = Object.keys(environments);
						if (targets.length > 0) {
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

						var targets = Object.keys(environments);
						if (targets.length > 0) {

							var root = project.filesystem.root.substr(_root.length);

							targets.forEach(function(target) {
								_fertilize(root, target);
							});

						}

					}

				}

			}

		}

	};


	return Module;

});

