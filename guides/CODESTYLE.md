
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

### Editorconfig

There's an `.editorconfig` file in the lycheeJS root and you have to use it.
Use `Tab` and NOT whitespaces. Our `Tab` is equivalent to `4 Whitespaces`.

```javascript
// GOOD
var data = _CACHE[id];
if (data !== null) {
    data.load(); // data is all in the same column.
}

// BAD
var data = _CACHE[id];
if (data !== null) {
  data.load(); // This is not easy to rasterize.
}
```


### Indentation and Whitespaces

Code with whitespaces is easier to read than without them.
Use whitespaces wherever semantically required and necessary.

Whitespaces are necessary between operators.

```javascript
// GOOD
var y = 15;
var x = 3 * 4 + (y / 3);

// BAD
var y=15;
var x=3*4+(y/3);
```


1 empty line is necessary when there's either a new condition
(if/else/switch) or a block of statements with more than 2 lines
of code.

```javascript
var data = _CACHE[id] || null;
if (data !== null) {

    data.onload = function() {

        var buffer = this.buffer;
        if (buffer instanceof Object) {

            buffer.blub = 'test';
            buffer.flag = true;
            buffer.woop = 123.37;

        }

    };

    data.load();

}
```

2 empty lines are necessary when there's a new leave-branch
condition or logical difference in the algorithm behaviour.

```javascript
var _my_method = function(data) {

    if (data !== null) {

        var filtered = [];

        data.forEach(function(entry) {

            if (entry.id > 100) {
                filtered.push(entry);
            }

        });

        return filtered;

    }


    // new leave-branch condition
    return null;

};
```


### Naming (Variables)

As in ES5 / ES6 all variables are basically references in terms of
classical programming languages, there's a necessity of using
uppercase / lowercase names for variables to easily figure out
the memory layout and behaviour of those.

- Static variables and Enums are completely written uppercase.
- Shared variables between multiple instances have a prefixed underscore.
- Constructors are written uppercase-first.
- Instances are written lowercase.
- Namespaces are written lowercase (as they are Object instances in ES5 / ES6).


```javascript
var _Entity = lychee.app.Entity;
var _CACHE  = {};

var Constructor = function(settings) {

    this.entity = new _Entity(settings);

    _CACHE.push(this);

};


var foo = new Constructor({ woop: true });
var bar = new Constructor({ woop: true });
```

As `lychee.define` or `new lychee.Definition()` uses a Definition
closure, you have full advantages of using shared and static variables
within the Definition closure. Shared variables all have to be assigned
at the top (See above section Class Definition Layout).


### Naming (Properties and Methods)

Properties of Classes and Modules are named accordingly to their visibility.

- Public properties are written lowercase.
- Protected properties are written lowercase and have a prefixed underscore.
- Private properties are written lowercase and have two prefixed underscores.
- If there's a public property with `name`, there has to exist a `setName` method on the prototype.
- The return value of a `setName` method always has to be `true` or `false`.
- The `setName` method is always called in the `Constructor`, so that it accepts a `settings[name]` value.

```javascript
var Class = function(data) {

    var settings = lychee.extend({}, data);


    this.blob = null;

    this._protected = false;

    this.__private  = {};


    this.setBlob(settings.blob);
    this.setFlag(settings.flag);

};

Class.prototype = {

    setBlob: function(blob) {

        blob = blob instanceof Object ? blob : null;

        if (blob !== null) {

            this.blob = blob;

            return true;

        }


        return false;

    },

    setFlag: function(flag) {

        if (flag === true || flag === false) {

            this.flag = flag;

            return true;

        }


        return false;

    }

};
```

Events are an exception, they have three prefixed underscores internally
to be available across all `lychee.Definition` instances without any conflicts.


### Data Type Validation

All methods accepting only specific data types have to use Ternaries in
order to validate the data type.

- `===` (deep equals) is used for `Boolean`.
- `instanceof` is used for `Array`, `Function`, `Object`.
- typeof` is used for `String`.
- `!== undefined` is used for `Scope Object` (used to call a `Function` or `callback`).

```javascript
var _my_method = function(flag, data, blob, str, callback, scope) {

    flag = flag === true;
    data     = data instanceof Array        ? data     : null;
    blob     = blob instanceof Object       ? blob     : null;
    str      = typeof str === 'string'      ? str      : null;
    callback = callback instanceof Function ? callback : null;
    scope    = scope !== undefined          ? scope    : this;


    if (data !== null && blob !== null) {

        // ...

        return true;

    }


    return false;

};
```


All Data Types injected by the `bootstrap.js` file (and being used in the `lychee.Asset`
implementation) are compatible with the `instanceof` operator.

- `instanceof` is used for `Config`, `Font`, `Music`, `Sound`, `Texture` and `Stuff`.
- `lychee.enumof()` is used for `Enum`.
- `lychee.interfaceof()` is used for `Interface` or `Class`.

```javascript
var _MODE = {
    'default': 0,
    'woop':    1
};

var _my_method = function(config, service, mode) {

    config  = config instanceof Config                        ? config  : null;
    service = lychee.interfaceof(lychee.net.Service, service) ? service : null;
    mode    = lychee.enumof(_MODE, mode)                      ? mode    : _MODE['default'];


    if (config !== null && service !== null) {

        // ...

        return true;

    }


    return false;

};
```

