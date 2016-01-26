
lychee.define('tool.state.Status').includes([
	'lychee.app.State',
	'lychee.event.Emitter'
]).tags({
	platform: 'html'
}).exports(function(lychee, tool, global, attachments) {

	/*
	 * HELPERS
	 */

	var _ui_update = function() {

		var config = new Config('http://localhost:4848/api/Project?timestamp=' + Date.now());
		var that   = this;

		config.onload = function(result) {
			_ui_render.call(that, this.buffer);
		};

		config.load();

	};

	var _ui_render = function(buffer) {

		if (buffer instanceof Array) {

			var main = this.main || null;
			if (main !== null) {

				var code     = '';
				var projects = buffer.filter(function(project) {
					return !project.identifier.match(/harvester/);
				});


				code += '<table>';

				code += '<tr>';
				code += '<th>Project</th>';
				code += '<th>Status</th>';
				code += '<th>Actions</th>';
				code += '</tr>';


				if (projects.length > 0) {

					projects.forEach(function(project) {

						var project_actions = [];
						var project_status  = '';

						if (project.server === null) {

							if (project.harvester === true) {
								project_actions.push('<a class="button ico-start ico-only" title="Start Project Server" href="lycheejs://start=' + project.identifier + '"></a>');
								project_status = '<label class="ico-offline">Offline</label>';
							} else {
								project_actions.push('<button class="ico-start ico-only" disabled></button>');
								project_status = '<label class="ico-offline" disabled>Offline</label>';
							}

						} else {
							project_actions.push('<a class="button ico-stop ico-only" title="Stop Project Server" href="lycheejs://stop=' + project.identifier + '"></a>');
							project_status = '<label class="ico-online">Online</label>';
						}


						if (project.filesystem !== null) {
							project_actions.push('<a class="button ico-folder ico-only" title="Open Project Folder" href="lycheejs://file=' + project.identifier + '"></a>');
						}


						project_actions.push('<a class="button ico-open ico-only" title="Open in Editor" href="lycheejs://edit=' + project.identifier + '"></a>');


						if (project.web instanceof Array) {

							project.web.forEach(function(entry) {

								if (entry.cultivator === true) {
									project_actions.push('<a title="' + entry.host + '" class="button ico-browser ico-only" title="Open in Browser" href="lycheejs://web=' + encodeURI('http://' + entry.host + '/projects/' + project.identifier) + '"></a>');
								} else {
									project_actions.push('<a title="' + entry.host + '" class="button ico-browser ico-only" title="Open in Browser" href="lycheejs://web=' + encodeURI('http://' + entry.host) + '"></a>');
								}

							});

						}


						code += '<tr>';
						code += '<td>' + project.identifier + '</td>';
						code += '<td>' + project_status + '</td>';
						code += '<td>' + project_actions.join(' ') + '</td>';
						code += '</tr>';

					});

				} else {

					code += '<tr>';
					code += '<td class="center" colspan="3" style="text-align:center">Harvester not ready.<br><br><button class="ico-refresh" onclick="location.href=\'./index.html\'">Refresh</button></td>';
					code += '</tr>';

				}


				code += '</table>';


				ui.render(code, 'section.active');

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.app.State.call(this, main);
		lychee.event.Emitter.call(this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize:   function() {},
		deserialize: function() {},



		/*
		 * CUSTOM API
		 */

		update: function(clock, delta) {
			_ui_update.call(this);
		},

		enter: function() {
			_ui_update.call(this);
		},

		leave: function() {
			_ui_render.call(this, null);
		}

	};


	return Class;

});

