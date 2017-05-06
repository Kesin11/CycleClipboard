const {
  app,
  BrowserWindow,
  globalShortcut,
  Tray,
  Menu
} = require('electron')
const path = require('path')
const url = require('url')
const ClipboardWatcher = require('./lib/ClipboardWatcher')
const { RELOAD_ENTRIES } = require('./lib/EventTypes')

let tray
let mainWindow
const clipboardWatcher = new ClipboardWatcher()

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
  clipboardWatcher.startPolling()
  // TODO: 最終的に不要であれば消しておく
  // clipboardWatcher.onAddEntry(() => {
  //   console.log("onAddEntry", clipboardWatcher.buffer)
  // })
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
  clipboardWatcher.destroy()
})

function registerGlobalShortcut () {
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    // rotate entries if window has already opend
    if (mainWindow.isVisible()) {
      const nextEntries = clipboardWatcher.getNextEntries()
      mainWindow.webContents.send(RELOAD_ENTRIES, nextEntries)
    // just open window
    } else {
      const nextEntries = clipboardWatcher.getEntries()
      mainWindow.webContents.send(RELOAD_ENTRIES, nextEntries)
      clipboardWatcher.startRotateMode()
      mainWindow.show()
    }
  })
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    mainWindow.hide()
    clipboardWatcher.endRotateMode()
    Menu.sendActionToFirstResponder('hide:') // 前のアプリにフォーカスを戻す
  })
}
