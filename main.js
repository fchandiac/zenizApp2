const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const url = require('url');
const port = 3001



//// --------> CONFIG JSON APP <-------/////////
const fs = require('fs')
const filePathConfig = path.join(__dirname, './config.json')
const rawDataConfig = fs.readFileSync(filePathConfig)
const config = JSON.parse(rawDataConfig)

///// --------> NODE ENV <-------/////////
//const env = process.env.NODE_ENV
const env = 'build'
///// --------------------------/////////



///// --------> EXPRESS CONFIG <-------/////////
const express = require('express');
const exp = express()

exp.set('json spaces', 2)
exp.use(express.json())
exp.use(express.urlencoded({ extended: false }))
const cors = require('cors')
exp.use(cors({ origin: '*' }))
exp.use(express.static(path.join(__dirname, './out')))


exp.get('/', (req, res) => {
	res.send('Server Work from Brries APP')
})

exp.listen(port, () => {
	console.log('app listening at http://localhost:' + port)
})


/////// --------> ELECTRON CONFIG <-------/////////
const createWindow = () => {
	var win = new BrowserWindow({
		width: 300,
		height: 500,
		minWidth: 300,
		minHeight: 500,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			enableRemoteModule: true,
			webSecurity: false
		},
	})

	var splash = new BrowserWindow({
		width: 500,
		height: 375,
		frame: false,
		alwaysOnTop: true
	})
	win.hide()
	splash.center()
	splash.hide()
	if (env == 'build') {
		splash.center()
		win.loadURL('http://localhost:' + port)
		splash.loadURL(url.format({
			pathname: path.join(__dirname, './splash/splash.html'),
			protocol: 'file',
			slashes: true
		}))
		setTimeout(function () {
			splash.show()
			setTimeout(function () {
				splash.close();
				win.maximize()
				win.show();
			}, 6000);
		}, 2000)
	} else {
		ejecuteNext(win, splash)
	}
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
	app.quit()
})

function ejecuteNext(win, splash) {
	/////// --------> NEXT SERVER <-------/////////
	const { createServer } = require('http');
	const next = require('next');
	const dev = env !== 'production';
	const nextApp = next({ dev });
	const handler = nextApp.getRequestHandler();
	win.hide()
	splash.hide()
	splash.center()

	nextApp
		.prepare()
		.then(() => {
			const server = createServer((req, res) => {
				// if (req.headers['user-agent'].indexOf('Electron') === -1) {
				// 	res.writeHead(404);
				// 	res.end()
				// 	return
				// }
				return handler(req, res);
			});
			server.listen(3000, (error) => {
				if (error) throw error
				console.log('NEXT SERVER START')
			})
			if (dev) {
				win.webContents.openDevTools();
			}
			win.loadURL('http://localhost:3000')

			win.on('close', () => {
				win = null;
				server.close();
			});
			splash.loadURL(url.format({
				pathname: path.join(__dirname, './splash/splash.html'),
				protocol: 'file',
				slashes: true
			}))
			setTimeout(function () {
				splash.show()
				setTimeout(function () {
					splash.close();
					win.maximize()
					win.show();
				}, 6000);
			}, 2000)
		})
}




// ipcMain.on('server-url', (e, arg) => {
// 	let rawDataConfig = fs.readFileSync(filePathConfig)
// 	let config = JSON.parse(rawDataConfig)
// 	e.returnValue = config.api.url
// })