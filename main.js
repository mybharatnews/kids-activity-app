const { app, BrowserWindow, session, shell } = require('electron');
const path = require('path');

// ===== GPU COMPLETELY DISABLE (Errors fix) =====
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-dev-shm-usage');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('use-gl', 'swiftshader');
app.commandLine.appendSwitch('in-process-gpu');

// ===== SECURITY: Security warnings disable =====
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// ===== SECURITY: Single instance lock (ek j window khule) =====
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length) {
            const win = windows[0];
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });
}

// ===== SECURITY: External links block =====
app.on('web-contents-created', (event, contents) => {
    // Navigation block karo (fakt local file allowed)
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        if (parsedUrl.protocol !== 'file:') {
            event.preventDefault();
            console.log('Blocked navigation to:', navigationUrl);
        }
    });

    // New window open block karo
    contents.setWindowOpenHandler(({ url }) => {
        console.log('Blocked new window:', url);
        return { action: 'deny' };
    });

    // WebView block karo
    contents.on('will-attach-webview', (event, webPreferences, params) => {
        delete webPreferences.preload;
        webPreferences.nodeIntegration = false;
        event.preventDefault();
    });
});

// ===== SECURITY: CSP header add =====
app.on('ready', () => {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: file:; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                    "font-src 'self' https://fonts.gstatic.com; " +
                    "img-src 'self' data: file:; " +
                    "connect-src 'self'"
                ]
            }
        });
    });
});

// ===== WINDOW CREATE =====
function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 900,
        minHeight: 600,
        title: "Dravy's English Learning App",
        icon: path.join(__dirname, 'icon.png'),
        backgroundColor: '#f0f4f8',
        show: false, // Pehla hide, pachi ready thay tyare show
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,         // ⚠️ Development ma true, production ma false karo
            webSecurity: true,      // Web security enable
            allowRunningInsecureContent: false,
            experimentalFeatures: false,
            enableRemoteModule: false,
            spellcheck: false
        }
    });

    // Menu bar hide karo
    win.setMenuBarVisibility(false);
    win.setAutoHideMenuBar(true);

    // Zoom disable karo (kids accidental zoom na kare)
    win.webContents.on('did-finish-load', () => {
        win.webContents.setZoomFactor(1);
        win.webContents.setVisualZoomLevelLimits(1, 1);
        
        // Mouse wheel + Ctrl thi zoom disable
        win.webContents.executeJavaScript(`
            document.addEventListener('wheel', (e) => {
                if (e.ctrlKey) e.preventDefault();
            }, { passive: false });
        `);
    });

    // Zoom shortcuts disable
    win.webContents.on('before-input-event', (event, input) => {
        // Ctrl + / Ctrl - / Ctrl 0 disable
        if (input.control && (input.key === '+' || input.key === '-' || input.key === '0' || input.key === '=')) {
            event.preventDefault();
        }
        // F5 / Ctrl+R (reload) disable
        if (input.key === 'F5' || (input.control && input.key.toLowerCase() === 'r')) {
            event.preventDefault();
        }
        // F12 (DevTools) disable
        if (input.key === 'F12') {
            event.preventDefault();
        }
        // Ctrl+Shift+I (DevTools) disable
        if (input.control && input.shift && input.key.toLowerCase() === 'i') {
            event.preventDefault();
        }
    });

    // ✅ MAIN APP LOAD KARO (app.html)
    win.loadFile('app.html');

    // Ready thay tyare show karo
    win.once('ready-to-show', () => {
        win.show();
    });

    // Fullscreen shortcuts disable (F11)
    win.on('enter-full-screen', () => {
        // Koi action nahi — kids ne fullscreen thi bahar nikalo
    });
}

// ===== APP READY =====
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// ===== APP CLOSE =====
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// ===== SECURITY: New window block (extra safety) =====
app.on('browser-window-created', (event, window) => {
    window.webContents.setWindowOpenHandler(() => {
        return { action: 'deny' };
    });
});

// ===== ERROR HANDLING =====
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    if (error.code === 'EPIPE') return;
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});