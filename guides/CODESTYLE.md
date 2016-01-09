
# Codestyle Guide for lycheeJS


## Library / Project Structure

### Packages

The `lychee.pkg` file is divided in three sub-hierarchies that are tracked by the build system.

- `api` is the documentation folder that contains all documentation files of the package.
- `asset` is the asset folder that contains all raw assets that are automatically integrated by the Editor.
- `build` is the build variants folder that is produced by the fertilizer. The equivalent `build/environments` section in the package sets up automatically generated build variants of the library or application.
- `source` is the source variants folder that every developer can live-edit without any build tasks in between.


### Namespaces

Each subfolder located in `source` or `build` or `api` has to be written lowercase and is automatically mapped into its equivalent namespace. It may contain either Entities or other namespace folders.

Each namespace can be mapped as a tag that allows the implementation of platform-specific adapters. Examples are `lychee.Input`, `lychee.Renderer`, `lychee.Storage`, `lychee.Viewport` or the `lychee.net` Stack. Those Definitions are mapped in the `platform` tag and often have nearly identical feature-detecting `supports()` method calls.

An important mention here is that tags can inherit from other tags. Those inheriting sub-tags are using a dash (`-`) as a divider. For example, the `html-nwjs` tag inherits from `html` and reuses its components (if they are not overwritten).

Examples:
- `lychee/source/platform/html/Renderer` is equivalent to `lychee.Renderer`
- `lychee/source/platform/html-nwjs/Renderer` is equivalent to `lychee.Renderer`
- `lychee/source/platform/node/Renderer` is equivalent to `lychee.Renderer`


### Definitions

Each file located in `source` or `build` or `api` has to be written Uppercase and non-camelized and is automatically mapped into its equivalent namespace hierarchy and identifier. A Definition has the file suffix `.js`. An Entity may contain further file suffixes (`json` for Config, `fnt` for Font, `msc` for Music, `snd` for Sound, `png` for Texture) of each will automatically be mapped into attachments of the same Definition with their corresponding subidentifier.

An important mention here is that every lychee.Definition can have attachments. The identifier for each Definition has to be uppercase and not camelized. If there's an additional `.` in the filename it is automatically mapped as an Attachment to the Definition.

These attachments are often necessary for reusable Entities that require Configs, Textures, Musics, Sounds or even raw Buffers as an attachment in order to be Plug & Play ready inside other Projects.


Examples:

- `lychee/source/data/JSON.js` is equivalent to `lychee.data.JSON`
- `lychee/source/platform/html/data/JSON.js` is equivalent to `lychee.data.JSON`
- `lychee/source/Foo.js` and `lychee/source/Foo.default.png` and `lychee/source/Foo.fancy.png` is equivalent to `lychee.Foo` with `attachments = { "default.png": (Texture), "fancy.png": (Texture)}`.


## Definition Layout

The lycheeJS Definition system always uses so-called Definition closures in order to have advanced memory functionality among different instances. A basic layout of a Definition has (if functionality required) these sections:

- Headers (lychee.define(), tags(), requires(), includes(), supports())
- FEATURE DETECTION section
- HELPERS section
- IMPLEMENTATION section
- ENTITY API section
- CUSTOM API section

An important mention here is that three Definition types supported:

- `Module` is a singleton that has only properties and methods, but no prototype. Its deserialize() call returns a `reference`.
- `Class` is a dynamic class implementation with public methods on its prototype. It is called using the `new <Definition>()` keyword. Its deserialize() call returns a `constructor`.
- `Callback` is a simple function that can not be called with the `new` keyword. Its deserialize() call returns a `reference`.



### Module Definition Layout

A basic layout of a `Module` looks like this:

```javascript
lychee.define('my.ENCODER').requires([
	// optional requirements
	'my.Other'
]).exports(function(lychee, my, global, attachments) {

	var _Other = my.Other;



	/*
	 * HELPERS
	 */

	var _encode = function(data) {
		return null;
	};

	var _decode = function(data) {
		return null;
	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			return {
				'reference': 'my.ENCODER',
				'arguments': []
			};

		},



		/*
		 * CUSTOM API
		 */

		encode: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {
				return _encode(data);
			}

			return null;

		},

		decode: function(blob) {

			blob = typeof blob === 'string' ? blob : null;


			if (blob !== null) {
				return _decode(blob);
			}

			return null;

		}

	};


	return Module;

});
```



### Class Definition Layout

```javascript
lychee.define('my.Definition').tags({
	// optional tags
	platform: 'html'
}).requires([
	// optional requirements
	'my.Other'
]).includes([
	// optional includes
	'lychee.game.Entity',
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	// optional feature detection
	if (typeof global.addEventListener === 'function') {
		return true;
	}

	return false;

}).exports(function(lychee, my, global, attachments) {

	var _Other         = my.Other;
	var _shared_memory = [];



	/*
	 * HELPERS
	 */

	var _do_fancy_stuff = function() {

		for (var s = 0, sl = _shared_memory.length; s++) {
			_shared_memory[s].update(); // stub API for demo usage
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.custom = null;


		this.setCustom(settings.custom);


		// This order has to be identical to lychee.Definition.prototype.includes() call
		lychee.game.Entity.call(this, settings);
		lychee.event.Emitter.call(this);


		_shared_memory.push(this);

		settings = null;

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		// 1. imperative methods
		update: function() {
			// stub API for demo usage
		},

		// 2. setters and getters
		setCustom: function(custom) {

			custom = typeof custom === 'string' ? custom : null;


			if (custom !== null) {

				this.custom = custom;

				return true;

			}


			return false;

		}

	};


	return Class;

});
```

### Callback Definition Layout
```javascript
lychee.define('my.Definition').exports(function(lychee, my, global, attachments) {

	var _device = null;



	/*
	 * FEATURE DETECTION
	 */

	(function(global) {

		if (global.device.match(/Android/)) {
			_device = 'Android';
		} else if (global.device.match(/Ubuntu/)) {
			_device = 'Ubuntu';
		}

	})(global);



	/*
	 * IMPLEMENTATION
	 */

	var Callback = function() {

		return _device; // stub API for demo usage

	};


	return Callback;

});
```



## Code Layout

### Indentation
### Naming (Properties)
### Naming (Methods)
### Data Type Validation

