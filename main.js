const electron = require('electron')
const clipboard = electron.clipboard
const globalShortcut = electron.globalShortcut

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const Tray = electron.Tray
let tray
const Menu = electron.Menu

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false
    // transparent: true
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  if (app.dock) app.dock.hide() // Don't show on dock
  tray = new Tray(path.join(__dirname, 'assets/icon20.png'))
  tray.on('click', () => {
    mainWindow.show()
  })
  registerGlobalShortcut()
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

let count = 1
function registerGlobalShortcut () {
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    console.log('CommandOrControl+Shift+V is pressed')

    mainWindow.webContents.send('countUp', count)
    count += 1

    mainWindow.show()
  })
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    console.log('CommandOrControl+Shift+C is pressed')
    mainWindow.hide()
    Menu.sendActionToFirstResponder('hide:') // 前のアプリにフォーカスを戻す
  })
}
