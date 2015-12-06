
lychee.define('sorbet.mod.Fertilizer').requires([
]).exports(function(lychee, sorbet, global, attachments) {

	/*
	 * HELPERS
	 */



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

			return false;

		},

		process: function(project) {


		}

	};


	return Module;

});

