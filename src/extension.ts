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

	constructor(private readonly context: vscode.ExtensionContext) {}

	async openCustomDocument(
		uri: vscode.Uri,
		_openContext: vscode.CustomDocumentOpenContext,
		_token: vscode.CancellationToken
	): Promise<vscode.CustomDocument> {
		return {
			uri,
			dispose: () => {},
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
				vscode.Uri.file(path.join(this.context.extensionPath, 'media')),
			],
		};

		webviewPanel.webview.html = this.getWebviewContent(
			webviewPanel.webview,
			document.uri
		);
	}

	private getWebviewContent(webview: vscode.Webview, fileUri: vscode.Uri): string {
		const fileName = path.basename(fileUri.fsPath);
		const fileData = fileUri.with({ scheme: 'vscode-resource' }).toString();

		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
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

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@r128/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@r128/examples/js/loaders/EXRLoader.js"></script>
    <script>
        let scene, camera, renderer, controls, mesh;
        let isRotating = false;
        let exposure = 0;

        // Get file data
        const fileUri = '${fileData}';
        const fileName = '${fileName}';

        function init() {
            const container = document.getElementById('viewer');
            const width = container.clientWidth;
            const height = container.clientHeight;

            // Scene setup
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 0.1;

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            container.appendChild(renderer.domElement);

            // Controls
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.autoRotate = false;
            controls.autoRotateSpeed = 2;
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;

            // Lighting
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 1, 0);
            scene.add(light);

            // Exposure control
            document.getElementById('exposure').addEventListener('change', (e) => {
                exposure = parseFloat(e.target.value);
                renderer.toneMappingExposure = Math.pow(2, exposure);
                document.getElementById('exposureValue').textContent = exposure.toFixed(1);
            });

            // Keyboard controls
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

            // Load HDR/EXR file
            loadHdrExrFile();

            // Handle window resize
            window.addEventListener('resize', onWindowResize);

            // Animation loop
            animate();
        }

        function loadHdrExrFile() {
            const isEXR = fileName.toLowerCase().endsWith('.exr');
            
            if (isEXR) {
                // For EXR files, we'll use a simple texture load
                const loader = new THREE.TextureLoader();
                loader.load(
                    fileUri,
                    (texture) => {
                        texture.colorSpace = THREE.LinearSRGBColorSpace;
                        texture.mapping = THREE.EquirectangularReflectionMapping;
                        
                        scene.background = texture;
                        scene.environment = texture;
                    },
                    undefined,
                    (error) => {
                        console.error('Failed to load EXR file:', error);
                        showError('Failed to load EXR file: ' + error.message);
                    }
                );
            } else {
                // For HDR files
                const loader = new THREE.TextureLoader();
                loader.load(
                    fileUri,
                    (texture) => {
                        texture.colorSpace = THREE.LinearSRGBColorSpace;
                        texture.mapping = THREE.EquirectangularReflectionMapping;
                        
                        scene.background = texture;
                        scene.environment = texture;
                    },
                    undefined,
                    (error) => {
                        console.error('Failed to load HDR file:', error);
                        showError('Failed to load HDR file: ' + error.message);
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

        // Initialize when DOM is ready
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

export function deactivate() {}
