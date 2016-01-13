
# Codestyle Guide for lycheeJS

1. [Project Layout](#project-layout)
  - [Packages](#packages)
  - [Namespaces](#namespaces)
  - [Definitions](#definitions)
2. [Definition Layout](#definition-layout)
  - [Modules](#modules)
  - [Classes](#classes)
  - [Callbacks](#callbacks)
3. [Code Layout](#code-layout)
  - [Editorconfig](#editorconfig)
  - [Indentation and Whitespaces](#indentation-and-whitespaces)
  - [Naming of Variables](#naming-variables)
  - [Naming of Properties and Methods](#naming-properties-and-methods)
  - [Data Type Comparison](#data-type-comparison)
  - [Data Type Validation](#data-type-validation)


## Project Layout

### Packages

The `lychee.pkg` file is divided in four sub-hierarchies that are tracked by the build system.

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

Each file located in `source` or `build` or `api` has to be written Uppercase and non-camelized and is automatically mapped into its equivalent namespace hierarchy and identifier. A Definition has the file suffix `.js`.

A Definition may have attachments. Those attachments are mapped by their file extension.

- `Buffer` for a generic binary buffer.
- `Config` for files with the `json`, `pkg` or `store` extension.
- `Font` for files with the `fnt` extension.
- `Music` for files with the `msc` extension.
- `Sound` for files with the `snd` extension.
- `Texture` for files with the `png` extension.

The identifier for each Definition has to be uppercase and not camelized. If there's an additional `.` in the filename it is automatically mapped as an Attachment to the Definition.


Examples:

- `lychee/source/data/JSON.js` is equivalent to `lychee.data.JSON`
- `lychee/source/platform/html/data/JSON.js` is equivalent to `lychee.data.JSON`
- `lychee/source/Foo.js` and `lychee/source/Foo.default.png` and `lychee/source/Foo.fancy.png` is equivalent to `lychee.Foo` with `attachments = { "default.png": (Texture), "fancy.png": (Texture)}`.


## Definition Layout

The lycheeJS Definition system always uses so-called Definition closures in order to have advanced memory functionality among different instances. A basic layout of a Definition has (if the functionality is required) these sections:

- HEADER
  - `lychee.define(identifier)`
  - `.tags()`
  - `.requires()`
  - `.includes()`
  - `.attaches()`
  - `.supports()`
  - `.exports()`
- BODY (inside `.exports(function() { /* BODY */ })`)
  - `FEATURE DETECTION` section
  - `HELPERS` section
  - `IMPLEMENTATION` section
  - `ENTITY API` section
  - `CUSTOM API` section
  - return of `Class`, `Module` or `Callback`

An important mention here is that three Definition types supported:

- `Module` is a singleton that has only properties and methods, but no prototype. Its `deserialize()` call returns a `reference`.
- `Class` is a dynamic class implementation with public methods on its prototype. It is called using the `new <Definition>()` keyword. Its `deserialize()` call returns a `constructor`.
- `Callback` is a simple function that can not be called with the `new` keyword. Its `deserialize()` call returns a `reference`.



### Modules

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



### Classes

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



### Callbacks

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


One empty line is necessary when there's either a new condition
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

Two empty lines are necessary when there's a new leave-branch
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


### Data Type Comparison

All methods accepting only specific data types have to use Ternaries in
order to validate the data type.

Always use literal data types for `Boolean`, `Number`, `String`, `RegExp`.
Always use a `===` (strict comparison) in the whole codebase.
Never use a `==` (abstract comparison).

- `===` (strict comparison) is used for `Boolean` and literal data types.
- `instanceof` is used for `Array`, `Function`, `Object`.
- `typeof` is used for `Number`, `String`.
- `!== undefined` is used for `Scope Object` (used to call a `Function` or `callback`).

```javascript
var _my_method = function(flag, data, blob, num, str, callback, scope) {

    flag     = flag === true;
    data     = data instanceof Array        ? data      : null;
    blob     = blob instanceof Object       ? blob      : null;
    num      = typeof num === 'number'      ? (num | 0) : null;
    str      = typeof str === 'string'      ? str       : null;
    callback = callback instanceof Function ? callback  : null;
    scope    = scope !== undefined          ? scope     : this;


    if (data !== null && blob !== null) {

        // ...

        return true;

    }


    return false;

};
```


All Data Types injected by the `bootstrap.js` file (and being used
in the `lychee.Asset` implementation) are compatible with the
`instanceof` operator.

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


### Data Type Validation

All Data Types are validated in positive-style branches. That means
each and every `Function` returns either always the same data type
or two opposite data types.

There are basically these variants on what a `Function` might return:

- `Object` or `null` is returned by a `Function` that gets data.
- `Array` is returned by a `Function` that filters data.
- `undefined` (nothing) is returned by a `Function` that updates or processes data.
- `true` or `false` is returned by a `Function` that validates data or a sets a state.

```javascript
var _CACHE    = [];
var _get_data = function() {

	if (_CACHE.length > 0) {
		return _CACHE.splice(0, 1);
	}


	return null;

};


var _filter_data = function(data) {

	var filtered = data.map(function(entry) {
		return entry.id.substr(0, 6) === 'lychee';
	});


	return filtered;

};


var _update_data = function(data) {

	data.forEach(function(entry) {
		entry.count++;
	});

};


lychee.Foo.prototype.setState = function(state) {

	state = typeof state === 'string' ? state : null;


	if (state !== null) {

		this.state = state;

		return true;

	}


	return false;

};
```

