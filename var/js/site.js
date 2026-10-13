import { ready } from '../../lib/arashtad/arashtad-3d-runtime-1.1.0.min.js';
import { enableTouchControlsForAll, enableInteractions } from '../../lib/arashtad/arashtad-3d-runtime-plugins-1.0.0.min.js';

enableTouchControlsForAll();

async function initializeCanvas(canvas) {
    try {
        const wrapper = canvas.parentElement;
        const preloader = wrapper?.querySelector('.preloader');
        const counter = preloader?.querySelector('.loading-counter');
        const bar = preloader?.querySelector('.loading-bar');

        canvas.classList.add('loading');

        let runtime = canvas.querySelector('arashtad-runtime');
        if (!runtime) {
            runtime = document.createElement('arashtad-runtime');
            runtime.setAttribute('resize', 'engine.resize()');
            canvas.appendChild(runtime);
        }

        let camera = canvas.querySelector('arashtad-camera');
        if (!camera) {
            camera = document.createElement('arashtad-camera');
            camera.id = `${canvas.id}-camera`;
            camera.setAttribute('type', 'ArcRotateCamera');
            camera.setAttribute('alpha', '1.57');
            camera.setAttribute('beta', '1.2');
            camera.setAttribute('radius', '12');
            camera.setAttribute('target', 'new BABYLON.Vector3(0, 0, 0)');
            camera.setAttribute('fov', '0.4');
            camera.setAttribute('minZ', '0.1');
            camera.setAttribute('maxZ', '1000');
            canvas.appendChild(camera);
        }

        canvas.style.background = 'transparent';

        const poster = canvas.getAttribute('poster');
        if (poster) {
            canvas.style.backgroundImage = `url("${poster}")`;
            canvas.style.backgroundSize = 'cover';
            canvas.style.backgroundPosition = 'center';
        }

        const scene = await ready(canvas);
        const interactions = enableInteractions(scene, canvas);

        if (counter) {
            counter.textContent = '100%';
        }
        if (bar) {
            bar.style.width = '100%';
        }

        canvas.classList.remove('loading');
        canvas.classList.add('loaded');

        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
                if (bar) {
                    bar.classList.add('hidden');
                }
            }, 200);
        }

        canvas.__arashtad3DLoader = { scene, interactions };
        return scene;

    } catch (error) {
        console.error(`Arashtad 3D [${canvas.id}]:`, error);
        canvas.classList.remove('loading');
        canvas.classList.add('loaded');
        return null;
    }
}

let initializationQueue = Promise.resolve();

document.querySelectorAll('.arashtad-3d-canvas').forEach(canvas => {
    initializationQueue = initializationQueue
        .then(() => initializeCanvas(canvas))
        .catch(error => {
            console.error(`Arashtad 3D [${canvas.id}]:`, error);
        });
});