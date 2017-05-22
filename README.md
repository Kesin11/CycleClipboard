# CycleClipboard [![Build Status](https://travis-ci.org/Kesin11/CycleClipboard.svg?branch=master)](https://travis-ci.org/Kesin11/CycleClipboard)

Clipboard extension app like yank-ring or kill-ring

![cycle_clipboard.gif](https://raw.githubusercontent.com/Kesin11/CycleClipboard/gif/gif/cycle_clipboard.gif)

## USAGE
1. Copy some text as normal.
2. Press `command + control + v` then the window will show up
3. Repeat `command + control + v` until text that you want to copy show in top of list.
4. press `Enter` (or wait few second) for copy selected text to system clipbord.

## Support OS
Currently only support macOS

## npm command

```bash
# install
npm install

# run the app
npm start

# release build
npm run release
```

## For development command

```bash
# run the app for debug
npm run dev

# test
npm test
npm test:watch

# lint
npm run lint
```

## Future work
- [ ] Create config view for changing global shortcut key and number of entry

## License
MIT
