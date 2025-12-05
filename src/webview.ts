// Webview entry point: bundles Three.js + OrbitControls + loaders into a single ESM module
import * as THREE from 'three';
import { OrbitControls } from '../media/OrbitControls.js';
import { RGBELoader } from '../media/RGBELoader.js';
import { EXRLoader } from '../media/EXRLoader.js';

// Expose global viewer initialization function to the webview HTML
(window as any).initViewer = function initViewer(fileUri: string, fileName: string) {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: InstanceType<typeof OrbitControls>;
    let isRotating = false;
    let exposure = 0;

    function init() {
        const container = document.getElementById('viewer') as HTMLDivElement;
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

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        if (isEXR) {
            const loader = new EXRLoader();
            loader.load(
                fileUri,
                (texture: THREE.DataTexture) => {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                    scene.background = envMap;
                    scene.environment = envMap;
                    texture.dispose();
                    pmremGenerator.dispose();
                },
                undefined,
                (err: any) => {
                    console.error('Failed to load EXR', err);
                    showError('Failed to load EXR file');
                }
            );
        } else {
            const loader = new RGBELoader();
            loader.setDataType(THREE.UnsignedByteType);
            loader.load(
                fileUri,
                (texture: THREE.DataTexture) => {
                    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                    scene.background = envMap;
                    scene.environment = envMap;
                    texture.dispose();
                    pmremGenerator.dispose();
                },
                undefined,
                (err: any) => {
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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
};

console.log('Webview bundle loaded. Call window.initViewer(dataUrl, fileName) to start.');
