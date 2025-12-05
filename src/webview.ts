// Webview entry point: bundles Three.js + OrbitControls + loaders into a single ESM module
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from '../media/OrbitControls.js';
// @ts-ignore
import { RGBELoader } from '../media/RGBELoader.js';
// @ts-ignore
import { EXRLoader } from '../media/EXRLoader.js';

console.log('Webview bundle loaded, THREE available:', typeof THREE !== 'undefined');

// Expose global viewer initialization function to the webview HTML
(window as any).initViewer = function initViewer(fileUri: string, fileName: string) {
    console.log('initViewer called with:', { fileUri: fileUri.substring(0, 50), fileName });
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: InstanceType<typeof OrbitControls>;
    let isRotating = false;
    let exposure = 0;

    function init() {
        console.log('Initializing viewer...');
        const container = document.getElementById('viewer') as HTMLDivElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        console.log('Container size:', width, 'x', height);

        scene = new THREE.Scene();
        console.log('Scene created');

        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 0.1);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        container.appendChild(renderer.domElement);
        console.log('Renderer created and added to DOM');

        controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        console.log('OrbitControls initialized');

        const exposureSlider = document.getElementById('exposure') as HTMLInputElement;
        exposureSlider?.addEventListener('change', (e) => {
            exposure = parseFloat((e.target as HTMLInputElement).value);
            renderer.toneMappingExposure = Math.pow(2, exposure);
            const exposureValueEl = document.getElementById('exposureValue');
            if (exposureValueEl) {
                exposureValueEl.textContent = exposure.toFixed(1);
            }
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
        console.log('Loading file as', isEXR ? 'EXR' : 'HDR');

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        console.log('PMREM generator created');

        if (isEXR) {
            const loader = new EXRLoader();
            console.log('EXRLoader created, attempting to load...');
            loader.load(
                fileUri,
                (texture: THREE.DataTexture) => {
                    console.log('EXR texture loaded successfully:', texture);
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                    scene.background = envMap;
                    scene.environment = envMap;
                    texture.dispose();
                    pmremGenerator.dispose();
                    console.log('EXR scene background and environment set');
                },
                undefined,
                (err: any) => {
                    console.error('Failed to load EXR', err);
                    showError('Failed to load EXR file: ' + err);
                }
            );
        } else {
            const loader = new RGBELoader();
            console.log('RGBELoader created, attempting to load...');
            loader.type = THREE.FloatType;
            loader.load(
                fileUri,
                (texture: THREE.DataTexture) => {
                    console.log('HDR texture loaded successfully:', texture);
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                    scene.background = envMap;
                    scene.environment = envMap;
                    texture.dispose();
                    pmremGenerator.dispose();
                    console.log('HDR scene background and environment set');
                },
                undefined,
                (err: any) => {
                    console.error('Failed to load HDR', err);
                    showError('Failed to load HDR file: ' + err);
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
        const container = document.getElementById('viewer') as HTMLDivElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function showError(message: string) {
        const info = document.getElementById('info');
        if (info) {
            info.innerHTML = '<div style="color: #ff6b6b; font-weight: bold;">Error</div><div style="margin-top: 8px;">' + message + '</div>';
        }
        console.warn('Showing fallback 2D viewer due to error:', message);
        show2DFallback(fileUri, fileName);
    }

    function show2DFallback(dataUrl: string, fileName: string) {
        console.log('Rendering 2D fallback...');
        const container = document.getElementById('viewer') as HTMLDivElement;
        
        // Clear the canvas if it exists
        const existingCanvas = container.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get 2D canvas context');
            return;
        }
        
        // Create image from data URL
        const img = new Image();
        img.onload = () => {
            console.log('2D fallback image loaded, drawing to canvas');
            // Draw with aspect ratio preserved, centered
            const containerAspect = canvas.width / canvas.height;
            const imageAspect = img.width / img.height;
            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let offsetX = 0;
            let offsetY = 0;
            
            if (imageAspect > containerAspect) {
                drawHeight = canvas.width / imageAspect;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.height * imageAspect;
                offsetX = (canvas.width - drawWidth) / 2;
            }
            
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };
        img.onerror = () => {
            console.error('Failed to load 2D fallback image');
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Failed to display file', canvas.width / 2, canvas.height / 2);
        };
        
        img.src = dataUrl;
        
        const info = document.getElementById('info');
        if (info) {
            info.innerHTML = '<div style="color: #ffb366; font-weight: bold;">2D Fallback View</div><div style="margin-top: 8px; opacity: 0.8; font-size: 11px;">3D viewer unavailable, showing 2D preview</div>';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
};

console.log('initViewer function registered on window');
