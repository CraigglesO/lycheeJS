
lychee.define('sorbet.serve.Redirect').exports(function(lychee, sorbet, global, attachments) {

	var Module = {

		can: function(host, url) {

			var identifier = null;
			var project    = null;
			var path       = null;
			var info       = null;


			// lychee + <a> + <b> + <c>
			if (url.substr(0, 9) === '/projects') {

				identifier = url.split('/')[2];
				project    = host.getProject(identifier);

				if (project !== null) {

					path = '/' + url.split('/').slice(1).join('/');
					info = project.filesystem.info(path);

					var dir = '/projects/' + identifier;
					if (path === dir || path === (dir + '/') || path === (dir + '/index.html')) {
						return true;
					}

				}

			// <cultivator> || <project>
			} else if (url === '/') {

				return true;


			} else {

				return true;

			}


			return false;

		},

		process: function(host, url, data, ready) {

			var identifier = null;
			var project    = null;
			var path       = null;
			var info       = null;


			// lychee + <a> + <b> + <c>
			if (url.substr(0, 9) === '/projects') {

				identifier = url.split('/')[2];
				project    = host.getProject(identifier);

				if (project !== null) {

					path = '/' + url.split('/').slice(1).join('/');
					info = project.filesystem.info(path);

					var dir = '/projects/' + identifier;
					if (path === dir || path === (dir + '/') || path === (dir + '/index.html')) {

						if (project.filesystem.info('/source/index.html') !== null) {

							ready({
								headers: { 'status': 301, 'location': dir + '/source/index.html' },
								payload: ''
							});

						} else if (project.filesystem.info('/index.html') !== null) {

							ready({
								headers: { 'status': 301, 'location': dir + '/index.html' },
								payload: ''
							});

						}

					}

				}

			// <cultivator> || <project>
			} else if (url === '/') {

				if (host.cultivator === true) {

					ready({
						headers: { 'status': 301, location: '/projects/cultivator/index.html' },
						payload: ''
					});

				} else {

					ready({
						headers: { 'status': 301, 'location': '/index.html' },
						payload: ''
					});

				}

			} else {

				ready({
					headers: { 'status': 301, 'location': '/index.html' },
					payload: ''
				});

			}

		}

	};


	return Module;

});

