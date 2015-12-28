
lychee.define('harvester.data.Project').requires([
	'harvester.data.Filesystem',
	'harvester.data.Package',
	'harvester.data.Server'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, harvester, global, attachments) {



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(identifier, root) {

		identifier = typeof identifier === 'string' ? identifier : null;
		root       = typeof root === 'string'       ? root       : ('/projects/' + identifier);


		this.identifier = identifier;
		this.filesystem = new harvester.data.Filesystem(root);
		this.package    = new harvester.data.Package(this.filesystem.read('/lychee.pkg'));
		this.server     = null;
		this.harvester  = this.filesystem.info('/harvester.js') !== null;


		lychee.event.Emitter.call(this);

	};




	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'harvester.data.Project';


			data['arguments'] = [ this.identifier, this.filesystem.root ];


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setPackage: function(package) {

			package = package instanceof harvester.data.Package ? package : null;


			if (package !== null) {

				this.package = package;

				return true;

			}


			return false;

		},

		setServer: function(server) {

			server = server instanceof harvester.data.Server ? server : null;


			if (server !== null) {

				this.server = server;

				return true;

			}


			return false;

		}

	};


	return Class;

});

