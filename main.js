const electron = require('electron')
const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Tray,
  Menu
} = require('electron')
const path = require('path')
const url = require('url')
const ClipboardWatcher = require('./lib/ClipboardWatcher')
const { RELOAD_ENTRIES, SUBMIT_ENTRY, FIX_ENTRY } = require('./lib/EventTypes')

const SUBMIT_TIMEOUT = 1500

let tray
let mainWindow
const clipboardWatcher = new ClipboardWatcher()
let submitTimeoutId

function createWindow () {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  const windowWidth = Math.floor(width * 0.8)
  const windowHeight = 400

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    center: true,
    show: false,
    frame: false,
    transparent: true
  })

  mainWindow.setPosition(Math.floor((width - windowWidth) / 2), Math.floor(height * 0.4))

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
}

function createTray () {
  tray = new Tray(path.join(__dirname, 'assets/icon20.png'))
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', role: 'quit'}
  ])
  tray.setContextMenu(contextMenu)
}

app.on('ready', () => {
  createWindow()
  createTray()
  if (app.dock) app.dock.hide() // Don't show on dock
  registerGlobalShortcut()
  clipboardWatcher.startPolling()
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
  clipboardWatcher.destroy()
})

// submit when press Enter key on mainWindow
ipcMain.on(SUBMIT_ENTRY, (_event) => {
  submit()
})

function registerGlobalShortcut () {
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    resetAutoSubmit()

    const nextEntries = clipboardWatcher.getNextEntries()
    mainWindow.webContents.send(RELOAD_ENTRIES, nextEntries)

    if (!mainWindow.isVisible()) mainWindow.show()

    mainWindow.focus()

    // auto submit
    submitTimeoutId = setTimeout(() => {
      submit()
    }, SUBMIT_TIMEOUT)
  })
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    submit()
  })
}

function submit () {
  resetAutoSubmit()

  clipboardWatcher.writeFirstEntry()
  clipboardWatcher.resetIndex()
  startFixEntryAnimation()
    // wait for animation
    .then(() => {
      mainWindow.hide()
      Menu.sendActionToFirstResponder('hide:') // 前のアプリにフォーカスを戻す
    })
}

function resetAutoSubmit () {
  if (submitTimeoutId) clearTimeout(submitTimeoutId)
}

function startFixEntryAnimation () {
  return new Promise((resolve) => {
    mainWindow.webContents.send(FIX_ENTRY)
    setTimeout(resolve, 500)
  })
}
