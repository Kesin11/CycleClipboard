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
const { RELOAD_ENTRIES, SUBMIT_ENTRY } = require('./lib/EventTypes')

const SUBMIT_TIMEOUT = 3000

let tray
let mainWindow
const clipboardWatcher = new ClipboardWatcher()
let submitTimeoutId

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
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
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
  mainWindow.hide()
  Menu.sendActionToFirstResponder('hide:') // 前のアプリにフォーカスを戻す
}

function resetAutoSubmit () {
  if (submitTimeoutId) clearTimeout(submitTimeoutId)
}
