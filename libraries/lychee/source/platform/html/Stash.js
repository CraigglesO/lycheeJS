
lychee.define('Stash').tags({
	platform: 'html'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

// TODO: Temporary Filesystem requirements
	return true;

}).exports(function(lychee, global, attachments) {

	var Class = function() {

// TODO: Everything

	};


	Class.TYPE = {
		persistent: 0,
		temporary:  1
	};


	Class.prototype = {

	};


	return Class;

});

