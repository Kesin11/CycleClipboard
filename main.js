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
  // mainWindow.webContents.openDevTools()
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

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

function registerGlobalShortcut () {
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    console.log('CommandOrControl+Shift+V is pressed')
    mainWindow.show()
  })
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    console.log('CommandOrControl+Shift+C is pressed')
    mainWindow.hide()
    Menu.sendActionToFirstResponder('hide:') // 前のアプリにフォーカスを戻す
  })
}
