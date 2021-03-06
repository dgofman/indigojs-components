'use strict';

const http = require('http'),
	opn = require('opn'),
	fs = require('fs'),
	port = process.env.PORT || 3000,
	mimeTypes = {
		html: 'text/html; charset=utf-8',
		js: 'text/javascript',
		css: 'text/css',
		less: 'text/css'
	};

const requestHandler = (req, res) => {
	if (req.url === '/' || req.url === '/index') {
		res.writeHead(302, {
			'Location': '/index?igo'
		});
		return res.end();
	}
	let filePath = req.url.indexOf('/index') === 0 ? 'index.html' : req.url.substring(1),
		arr = filePath.split('.'),
		ext = arr.pop();

	if (ext === 'less') {
		filePath = 'build/static/css/' + arr.join('.') + '.css';
	}

	fs.exists(filePath, exists => {
		if (exists) {
			if (mimeTypes[ext]) {
				res.writeHead(200, {
					'Content-Type': mimeTypes[ext]
				});
			}
			fs.createReadStream(filePath).pipe(res);
		} else {
			res.writeHead(400, {'Content-Type': 'text/plain'});
			res.end('ERROR file not found: ' + filePath);
		}
	});
};

const server = http.createServer(requestHandler);
server.listen(port, (err) => {
	if (err) {
		return console.error(err);
	}
	opn(`http://localhost:${port}`);
	console.log(`Server is running on port ${port}`);
});