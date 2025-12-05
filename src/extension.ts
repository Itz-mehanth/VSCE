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

        const threeUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'three.module.js'));
        const orbitControlsUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'OrbitControls.js'));
        const rgbeLoaderUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'RGBELoader.js'));
        const exrLoaderUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'EXRLoader.js'));
        const fflateUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'fflate.module.js'));

        webviewPanel.webview.html = this.getWebviewContent(
            webviewPanel.webview,
            dataUrl,
            fileName,
            threeUri,
            orbitControlsUri,
            rgbeLoaderUri,
            exrLoaderUri,
            fflateUri
        );
    }

    private getWebviewContent(
        webview: vscode.Webview,
        dataUrl: string,
        fileName: string,
        threeUri: vscode.Uri,
        orbitControlsUri: vscode.Uri,
        rgbeLoaderUri: vscode.Uri,
        exrLoaderUri: vscode.Uri,
        fflateUri: vscode.Uri
    ): string {

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob: data:; script-src ${webview.cspSource} 'unsafe-inline'; style-src ${webview.cspSource} 'unsafe-inline';">
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
    </style>
    <script type="importmap">
        {
            "imports": {
                "three": "${threeUri}",
                "three/examples/jsm/libs/fflate.module.js": "${fflateUri}"
            }
        }
    </script>
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
    <script>
        // Debug: surface the computed webview URIs and test fetching the fflate module
        (function(){
            try {
                console.log('DEBUG: threeUri ->', '${threeUri}');
                console.log('DEBUG: orbitControlsUri ->', '${orbitControlsUri}');
                console.log('DEBUG: rgbeLoaderUri ->', '${rgbeLoaderUri}');
                console.log('DEBUG: exrLoaderUri ->', '${exrLoaderUri}');
                console.log('DEBUG: fflateUri ->', '${fflateUri}');
                // Try fetching the fflate module to reveal status and any 401/403 in DevTools network
                fetch('${fflateUri}').then(r => {
                    console.log('DEBUG: fetch fflate status', r.status, r.type, r.url);
                    return r.text().then(t => console.log('DEBUG: fflate length', t.length));
                }).catch(e => console.error('DEBUG: fetch fflate failed', e));
            } catch (e) { console.error('DEBUG: uri debug failed', e); }
        })();
    </script>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from '${orbitControlsUri}';
        import { RGBELoader } from '${rgbeLoaderUri}';
        import { EXRLoader } from '${exrLoaderUri}';
        
        const PMREMGenerator = THREE.PMREMGenerator;

        let scene, camera, renderer, controls;
        let isRotating = false;
        let exposure = 0;

        // Get file data (data URL) and filename
        const fileUri = '${dataUrl}';
        const fileName = '${fileName}';

        function init() {
            const container = document.getElementById('viewer');
            const width = container.clientWidth;
            const height = container.clientHeight;

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.set(0, 0, 0.1);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            container.appendChild(renderer.domElement);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.autoRotate = false;
            controls.autoRotateSpeed = 2;
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;

            document.getElementById('exposure').addEventListener('change', (e) => {
                exposure = parseFloat(e.target.value);
                renderer.toneMappingExposure = Math.pow(2, exposure);
                document.getElementById('exposureValue').textContent = exposure.toFixed(1);
            });

            window.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                    isRotating = !isRotating;
                    controls.autoRotate = isRotating;
                    e.preventDefault();
                }
                if (e.code === 'KeyR') {
                    camera.position.set(0, 0, 0.1);
                    controls.target.set(0, 0, 0);
                    controls.update();
                }
            });

            loadHdrExrFile();

            window.addEventListener('resize', onWindowResize);
            animate();
        }

        function loadHdrExrFile() {
            const isEXR = fileName.toLowerCase().endsWith('.exr');

            const pmremGenerator = new PMREMGenerator(renderer);
            pmremGenerator.compileEquirectangularShader();

            if (isEXR) {
                const loader = new EXRLoader();
                loader.load(
                    fileUri,
                    (texture) => {
                        texture.mapping = THREE.EquirectangularReflectionMapping;
                        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                        scene.background = envMap;
                        scene.environment = envMap;
                        texture.dispose();
                        pmremGenerator.dispose();
                    },
                    undefined,
                    (err) => {
                        console.error('Failed to load EXR', err);
                        showError('Failed to load EXR file');
                    }
                );
            } else {
                const loader = new RGBELoader();
                loader.setDataType(THREE.UnsignedByteType);
                loader.load(
                    fileUri,
                    (texture) => {
                        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                        scene.background = envMap;
                        scene.environment = envMap;
                        texture.dispose();
                        pmremGenerator.dispose();
                    },
                    undefined,
                    (err) => {
                        console.error('Failed to load HDR', err);
                        showError('Failed to load HDR file');
                    }
                );
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        function onWindowResize() {
            const container = document.getElementById('viewer');
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        function showError(message) {
            const info = document.getElementById('info');
            info.innerHTML = '<div style="color: #ff6b6b; font-weight: bold;">Error</div><div style="margin-top: 8px;">' + message + '</div>';
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
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
