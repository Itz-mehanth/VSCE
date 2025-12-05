import * as vscode from 'vscode';
import * as path from 'path';

class HdrExrEditorProvider implements vscode.CustomReadonlyEditorProvider {
    public static readonly viewType = 'hdrExr360Viewer.viewer';

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new HdrExrEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(
            HdrExrEditorProvider.viewType,
            provider
        );
        return providerRegistration;
    }

    constructor(private readonly context: vscode.ExtensionContext) { }

    async openCustomDocument(
        uri: vscode.Uri,
        _openContext: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        return {
            uri,
            dispose: () => { },
        };
    }

    async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                // Allow loading local extension resources from the packaged extension.
                vscode.Uri.joinPath(this.context.extensionUri, 'media'),
                this.context.extensionUri
            ],
        };

        // Read file as binary and convert to base64 data URL
        const fileData = await vscode.workspace.fs.readFile(document.uri);
        const fileName = path.basename(document.uri.fsPath);
        const mimeType = fileName.endsWith('.exr') ? 'image/x-exr' : 'image/vnd.radiance';
        const base64Data = Buffer.from(fileData).toString('base64');
        const dataUrl = `data:${mimeType};base64,${base64Data}`;

        // Generate webview URI for the bundled webview script
        const webviewBundleUri = webviewPanel.webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'media', 'webview-bundle.js')
        );

        webviewPanel.webview.html = this.getWebviewContent(
            webviewPanel.webview,
            dataUrl,
            fileName,
            webviewBundleUri
        );
    }

    private getWebviewContent(
        webview: vscode.Webview,
        dataUrl: string,
        fileName: string,
        webviewBundleUri: vscode.Uri
    ): string {

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob: data:; script-src ${webview.cspSource} 'unsafe-inline'; style-src ${webview.cspSource} 'unsafe-inline'; connect-src data: blob:;">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>360 HDR/EXR Viewer - ${fileName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            width: 100%;
            height: 100vh;
            overflow: hidden;
            background: #000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        #viewer {
            width: 100%;
            height: 100%;
        }

        #controls {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 100;
            backdrop-filter: blur(5px);
        }

        #info {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 100;
            backdrop-filter: blur(5px);
        }

        #exposureControl {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 100;
            backdrop-filter: blur(5px);
        }

        input[type="range"] {
            width: 150px;
            cursor: pointer;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div id="viewer"></div>
    
    <div id="info">
        <div style="font-weight: bold;">File: ${fileName}</div>
        <div style="margin-top: 8px; opacity: 0.8;">
            Use mouse to rotate • Scroll to zoom
        </div>
    </div>

    <div id="exposureControl">
        <label>Exposure</label>
        <input type="range" id="exposure" min="-5" max="5" step="0.1" value="0" />
        <div style="margin-top: 8px; font-size: 11px;" id="exposureValue">0.0</div>
    </div>

    <div id="controls">
        Space: Toggle rotation | R: Reset view
    </div>

    <script src="${webviewBundleUri}"></script>
    <script>
        (async () => {
            try {
                console.log('Starting viewer initialization...');
                // Wait a tick to ensure the bundle is fully loaded
                await new Promise(resolve => setTimeout(resolve, 100));
                if (typeof window.initViewer === 'function') {
                    console.log('Calling window.initViewer...');
                    window.initViewer('${dataUrl}', '${fileName}');
                } else {
                    throw new Error('window.initViewer is not a function');
                }
            } catch (err) {
                console.error('Failed to initialize viewer:', err);
                const info = document.getElementById('info');
                if (info) {
                    info.innerHTML = '<div style="color: #ff6b6b; font-weight: bold;">Error</div><div style="margin-top: 8px;">Failed to initialize viewer: ' + err + '</div>';
                }
            }
        })();
    </script>
</body>
</html>`;
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('HDR/EXR 360 Viewer extension activated!');
    context.subscriptions.push(HdrExrEditorProvider.register(context));
}

export function deactivate() { }
