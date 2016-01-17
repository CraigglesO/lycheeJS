
lychee.define('lychee.ui.Upload').tags({
	platform: 'html'
}).includes([
	'lychee.ui.Button'
]).supports(function(lychee, global) {

	if (typeof global.document !== 'undefined' && typeof global.document.createElement === 'function') {

		if (typeof global.FileReader !== 'undefined' && typeof global.FileReader.prototype.readAsDataURL === 'function') {
			return true;
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	var _instances = [];
	var _wrappers  = [];


	var _MIME = {
		'fnt':   'application/json',
		'json':  'application/javascript',
		'pkg':   'application/json',
		'png':   'image/png',
		'store': 'application/json'
	};


	var _wrap = function(instance) {

		var allowed = Object.values(_MIME);
		var element = global.document.createElement('input');


		element.setAttribute('accept',   '.fnt,.json,.pkg,.png,.store');
		element.setAttribute('type',     'file');
		element.setAttribute('multiple', '');


		element.onchange = function() {

			var val = [];


			[].slice.call(this.files).forEach(function(file) {

				if (allowed.indexOf(file.type) !== -1) {

					var reader = new global.FileReader();

					reader.onload = function() {

						var asset = new lychee.Asset(reader.result, null, true);
						if (asset !== null) {
							val.push(asset);
						}

					};

					reader.readAsDataURL(file);

				}

			});


			setTimeout(function() {

				var result = instance.setValue(val);
				if (result === true) {
					instance.trigger('change', [ val ]);
				}

			}, 1000);

		};


		_wrappers.push(element);

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({
			label: 'UPLOAD'
		}, data);


		this.value = [];


		this.setValue(settings.value);

		delete settings.value;


		lychee.ui.Button.call(this, settings);

		settings = null;


		_instances.push(this);
		_wrappers.push(_wrap(this));



		/*
		 * INITIALIZATION
		 */

		this.unbind('touch');
		this.bind('touch', function() {

			var wrapper = _wrappers[_instances.indexOf(this)] || null;
			if (wrapper !== null) {
				wrapper.click();
			}

		}, this);

	};


	Class.prototype = {

		setValue: function(value) {

			value = value instanceof Array ? value : null;


			if (value !== null) {

				this.value = value.filter(function(asset) {

					if (asset instanceof global.Config)  return true;
					if (asset instanceof global.Font)    return true;
					if (asset instanceof global.Music)   return true;
					if (asset instanceof global.Sound)   return true;
					if (asset instanceof global.Texture) return true;
					if (asset instanceof global.Stuff)   return true;


					return false;

				});


				return true;

			}


			return false;

		}

	};


	return Class;

});

