import { ready, loadModel } from '../../lib/arashtad/arashtad-3d-runtime-1.1.0.min.js';

const { __ } = wp.i18n;

const canvas = document.getElementById('arashtad-admin-preview');
const modelInput = document.getElementById('arashtad_model');
const mediaBox = document.querySelector('.arashtad-model-media');
const selectButton = document.getElementById('arashtad_select_model');
const clearButton = document.getElementById('arashtad_clear_model');
const preloader = document.querySelector('.preloader');
const bar = document.querySelector('.loading-bar');
const posterEnabled = document.getElementById('arashtad_poster_enabled');
const posterSettings = document.getElementById('arashtad-poster-settings');
const posterImageId = document.getElementById('arashtad_poster_image_id');
const posterPreview = document.getElementById('arashtad-poster-preview');
const selectPosterButton = document.getElementById('arashtad-select-poster');
const clearPosterButton = document.getElementById('arashtad-clear-poster');

let posterFrame = null;
let scene = null;
let model = null;
let currentCamera = null;
let canvasWrapper = null;

function setCanvasState(loaded) {
    canvas.classList.toggle('loaded', loaded);
    canvas.classList.toggle('loading', !loaded);
}

function setPreloader(hidden) {
    preloader?.classList.toggle('hidden', hidden);
    bar?.classList.toggle('hidden', hidden);
}

function getSource() {
    return modelInput.value.trim();
}

function updateWrapperStyles() {
    if (!canvasWrapper) {
        canvasWrapper = canvas.closest('.canvas-wrapper');
    }
    if (!canvasWrapper) return;
    
    const styleFields = document.querySelectorAll('[name^="arashtad_styles["]');
    const styles = {};
    styleFields.forEach(field => {
        const key = field.name.match(/arashtad_styles\[([^\]]+)\]/);
        if (key && key[1]) {
            styles[key[1]] = field.value;
        }
    });
    
    const styleMap = {
        'position': styles.position || 'relative',
        'z_index': styles.z_index || '1',
        'top': styles.top || 'auto',
        'left': styles.left || 'auto',
        'bottom': styles.bottom || 'auto',
        'right': styles.right || 'auto',
        'transform': styles.transform || 'none',
        'margin': styles.margin || '0',
        'padding': styles.padding || '0',
        'width': styles.width || '100%',
        'max_width': styles.max_width || '100%',
        'height': styles.height || 'auto',
        'max_height': styles.max_height || '100%',
        'aspect_ratio': styles.aspect_ratio || '16 / 9',
        'border': styles.border || '2px solid #333333',
        'border_radius': styles.border_radius || '10px',
        'overflow': styles.overflow || 'hidden',
        'box_sizing': styles.box_sizing || 'border-box',
        'box_shadow': styles.box_shadow || '0 0 20px rgba(0, 0, 0, .4)',
        'outline': styles.outline || 'none'
    };
    
    Object.keys(styleMap).forEach(key => {
        const cssKey = key.replace(/_/g, '-');
        const value = styleMap[key];
        if (value && value !== '') {
            canvasWrapper.style[cssKey] = value;
        } else {
            canvasWrapper.style[cssKey] = '';
        }
    });
}

async function updateModelInScene() {
    if (!scene) return;

    const modelNode = scene.getTransformNodeByName?.('arashtad-admin-model-root');

    if (!modelNode) return;

    const getNumber = (name, fallback) => {
        const value = parseFloat(document.querySelector(`[name="arashtad_model_settings[${name}]"]`)?.value);
        return Number.isFinite(value) ? value : fallback;
    };

    modelNode.position.x = getNumber('position_x', 0);
    modelNode.position.y = getNumber('position_y', 0);
    modelNode.position.z = getNumber('position_z', 0);

    modelNode.rotation.x = getNumber('rotation_x', 0);
    modelNode.rotation.y = getNumber('rotation_y', 0);
    modelNode.rotation.z = getNumber('rotation_z', 0);

    modelNode.scaling.x = getNumber('scaling_x', 1);
    modelNode.scaling.y = getNumber('scaling_y', 1);
    modelNode.scaling.z = getNumber('scaling_z', 1);
}

function addModelSettingsListeners() {
    const modelFields = document.querySelectorAll(
        '[name^="arashtad_model_settings[position_"], ' +
        '[name^="arashtad_model_settings[rotation_"], ' +
        '[name^="arashtad_model_settings[scaling_"]'
    );

    modelFields.forEach(field => {
        field.addEventListener('change', async () => {
            try {
                await updateModelInScene();
            } catch (error) {
                console.error('Failed to update model:', error);
            }
        });

        field.addEventListener('input', debounce(async () => {
            try {
                await updateModelInScene();
                setCanvasState(true);
                setPreloader(true);
            } catch (error) {
                console.error('Failed to update model:', error);
            }
        }, 100));
    });
}

async function updateClearColor() {
    if (!scene) return;
    const colorInput = document.querySelector('[name="arashtad_clear_color"]');
    if (!colorInput) return;
    const colorStr = colorInput.value.trim();
    if (!colorStr) return;
    const parts = colorStr.split(',').map(s => parseFloat(s.trim()));
    if (parts.length !== 4) return;
    const [r, g, b, a] = parts;
    if (scene.clearColor) {
        scene.clearColor.r = r;
        scene.clearColor.g = g;
        scene.clearColor.b = b;
        scene.clearColor.a = a;
    }
}

function getLightType() {
    return document.getElementById('light_type')?.value || 'DirectionalLight';
}

function getLightNumber(id, fallback) {
    const value = parseFloat(document.getElementById(id)?.value);
    return Number.isFinite(value) ? value : fallback;
}

function getLightConfig() {
    return {
        type: getLightType(),
        directionX: getLightNumber('light_direction_x', 0),
        directionY: getLightNumber('light_direction_y', -1),
        directionZ: getLightNumber('light_direction_z', -2),
        positionX: getLightNumber('light_position_x', 0),
        positionY: getLightNumber('light_position_y', 5),
        positionZ: getLightNumber('light_position_z', 0),
        intensity: getLightNumber('light_intensity', 3),
        angle: getLightNumber('light_angle', 1.0472),
        exponent: getLightNumber('light_exponent', 2)
    };
}

function getBabylonLight() {
    if (!scene) return null;
    return scene.getLightByName?.('arashtad-light') || scene.lights?.find(light => light.id === 'arashtad-light' || light.name === 'arashtad-light') || null;
}

function applyLightToScene() {
    const light = getBabylonLight();
    if (!light) return false;
    const config = getLightConfig();
    light.intensity = config.intensity;
    if (['HemisphericLight', 'DirectionalLight', 'SpotLight'].includes(config.type)) {
        light.direction = new BABYLON.Vector3(config.directionX, config.directionY, config.directionZ);
    }
    if (['PointLight', 'SpotLight'].includes(config.type)) {
        light.position = new BABYLON.Vector3(config.positionX, config.positionY, config.positionZ);
    }
    if (light.angle !== undefined && config.type === 'SpotLight') {
        light.angle = config.angle;
    }
    if (light.exponent !== undefined && config.type === 'SpotLight') {
        light.exponent = config.exponent;
    }
    return true;
}

async function rebuildLight() {
    if (!scene) return null;
    const config = getLightConfig();
    const oldLight = getBabylonLight();
    if (oldLight) oldLight.dispose();
    let light;
    const name = 'arashtad-light';
    if (config.type === 'HemisphericLight') {
        light = new BABYLON.HemisphericLight(name, new BABYLON.Vector3(config.directionX, config.directionY, config.directionZ), scene);
    } else if (config.type === 'DirectionalLight') {
        light = new BABYLON.DirectionalLight(name, new BABYLON.Vector3(config.directionX, config.directionY, config.directionZ), scene);
    } else if (config.type === 'PointLight') {
        light = new BABYLON.PointLight(name, new BABYLON.Vector3(config.positionX, config.positionY, config.positionZ), scene);
    } else if (config.type === 'SpotLight') {
        light = new BABYLON.SpotLight(name, new BABYLON.Vector3(config.positionX, config.positionY, config.positionZ), new BABYLON.Vector3(config.directionX, config.directionY, config.directionZ), config.angle, config.exponent, scene);
    } else {
        return null;
    }
    light.intensity = config.intensity;
    const oldLightElement = canvas.querySelector('light#arashtad-light');
    if (oldLightElement) oldLightElement.remove();
    const lightElement = document.createElement('arashtad-light');
    lightElement.id = 'arashtad-light';
    lightElement.setAttribute('type', config.type);
    if (['HemisphericLight', 'DirectionalLight', 'SpotLight'].includes(config.type)) {
        lightElement.setAttribute('direction', `new BABYLON.Vector3(${config.directionX}, ${config.directionY}, ${config.directionZ})`);
    }
    if (['PointLight', 'SpotLight'].includes(config.type)) {
        lightElement.setAttribute('position', `new BABYLON.Vector3(${config.positionX}, ${config.positionY}, ${config.positionZ})`);
    }
    if (config.type === 'SpotLight') {
        lightElement.setAttribute('angle', config.angle);
        lightElement.setAttribute('exponent', config.exponent);
    }
    lightElement.setAttribute('intensity', config.intensity);
    const runtime = canvas.querySelector('arashtad-runtime');
    if (runtime) canvas.insertBefore(lightElement, runtime.nextSibling);
    else canvas.appendChild(lightElement);
    scene.render();
    return light;
}

async function updateLightInScene() {
    if (!scene) return;
    const light = getBabylonLight();
    const type = getLightType();
    if (light && light.getClassName?.() === type) {
        applyLightToScene();
        return;
    }
    await rebuildLight();
}

function addLightChangeListeners() {
    const lightFields = document.querySelectorAll('.arashtad-light-settings input, .arashtad-light-settings select');
    lightFields.forEach(field => {
        field.addEventListener('change', async () => {
            try {
                await updateLightInScene();
                toggleLightFields();
                setCanvasState(true);
                setPreloader(true);
            } catch (error) {
                console.error('Failed to update light:', error);
            }
        });
        field.addEventListener('input', debounce(async () => {
            try {
                await updateLightInScene();
                setCanvasState(true);
                setPreloader(true);
            } catch (error) {
                console.error('Failed to update light:', error);
            }
        }, 200));
    });
}

function toggleLightFields() {
    const type = document.getElementById('light_type')?.value || 'DirectionalLight';
    document.querySelectorAll('.light-direction-fields').forEach(el => {
        el.style.display = ['HemisphericLight', 'DirectionalLight', 'SpotLight'].includes(type) ? '' : 'none';
    });
    document.querySelectorAll('.light-position-fields').forEach(el => {
        el.style.display = ['PointLight', 'SpotLight'].includes(type) ? '' : 'none';
    });
    document.querySelectorAll('.light-angle-fields, .light-exponent-fields').forEach(el => {
        el.style.display = type === 'SpotLight' ? '' : 'none';
    });
}

async function reloadScene() {
    if (!canvas) return;
    try {
        const url = getSource();
        const runtime = canvas.querySelector('arashtad-runtime');
        if (runtime) {
            const existing = runtime.querySelector('arashtad-model');
            if (existing) existing.remove();
            if (url) {
                const modelElement = document.createElement('arashtad-model');
                modelElement.id = 'arashtad-admin-model';
                modelElement.setAttribute('src', url);
                runtime.appendChild(modelElement);
            }
        }
        await initScene();
        setCanvasState(true);
        setPreloader(true);
    } catch (error) {
        console.error('Arashtad 3D:', error);
        setCanvasState(true);
        setPreloader(true);
    }
}

function getCameraNumber(id, fallback) {
    const value = parseFloat(document.getElementById(id)?.value);
    return Number.isFinite(value) ? value : fallback;
}

async function updateCameraInScene() {
    if (!scene || !currentCamera) return;

    const cameraType = document.getElementById('camera_type')?.value || 'ArcRotateCamera';

    const target = new BABYLON.Vector3(
        getCameraNumber('target_x', 0),
        getCameraNumber('target_y', 0),
        getCameraNumber('target_z', 0)
    );

    currentCamera.fov = getCameraNumber('fov', 0.4);
    currentCamera.minZ = getCameraNumber('minZ', 0.1);
    currentCamera.maxZ = getCameraNumber('maxZ', 1000);

    if (cameraType === 'ArcRotateCamera') {
        const position = new BABYLON.Vector3(
            getCameraNumber('position_x', currentCamera.position.x),
            getCameraNumber('position_y', currentCamera.position.y),
            getCameraNumber('position_z', currentCamera.position.z)
        );
    
        const offset = position.subtract(target);
        const radius = offset.length();
    
        if (radius > 0) {
            currentCamera.radius = radius;
            currentCamera.alpha = Math.atan2(offset.z, offset.x);
            currentCamera.beta = Math.acos(
                Math.min(1, Math.max(-1, offset.y / radius))
            );
        }
    
        currentCamera.setTarget(target);
    
        currentCamera.fov = getCameraNumber('fov', 0.4);
        currentCamera.minZ = getCameraNumber('minZ', 0.1);
        currentCamera.maxZ = getCameraNumber('maxZ', 1000);
    
        const enabled = document.getElementById('use_auto_rotate')?.checked || false;
        currentCamera.useAutoRotationBehavior = enabled;
    
        if (enabled && currentCamera.autoRotationBehavior) {
            currentCamera.autoRotationBehavior.idleRotationSpeed =
                getCameraNumber('idle_rotation_speed', 0.1);
    
            currentCamera.autoRotationBehavior.idleRotationWaitTime =
                getCameraNumber('idle_rotation_wait_time', 3000);
    
            currentCamera.autoRotationBehavior.idleRotationSpinupTime =
                getCameraNumber('idle_rotation_spinup_time', 6000);
        }
    } else {
        currentCamera.position.x = getCameraNumber('position_x', 0);
        currentCamera.position.y = getCameraNumber('position_y', 0);
        currentCamera.position.z = getCameraNumber('position_z', 3);
    
        currentCamera.setTarget(target);
    
        currentCamera.fov = getCameraNumber('fov', 0.4);
        currentCamera.minZ = getCameraNumber('minZ', 0.1);
        currentCamera.maxZ = getCameraNumber('maxZ', 1000);
    }

    scene.activeCamera = currentCamera;
}

async function rebuildCamera() {
    if (!scene || !canvas) return;

    const cameraType = document.getElementById('camera_type')?.value || 'ArcRotateCamera';

    if (currentCamera) {
        currentCamera.detachControl?.();
        currentCamera.dispose();
        currentCamera = null;
    }

    const target = new BABYLON.Vector3(
        getCameraNumber('target_x', 0),
        getCameraNumber('target_y', 0),
        getCameraNumber('target_z', 0)
    );

    let camera;

    if (cameraType === 'ArcRotateCamera') {
        camera = new BABYLON.ArcRotateCamera(
            `${canvas.id}-camera`,
            getCameraNumber('alpha', 1.57),
            getCameraNumber('beta', 1.2),
            getCameraNumber('radius', 12),
            target,
            scene
        );
    } else {
        const position = new BABYLON.Vector3(
            getCameraNumber('position_x', 0),
            getCameraNumber('position_y', 0),
            getCameraNumber('position_z', 3)
        );

        if (cameraType === 'UniversalCamera') {
            camera = new BABYLON.UniversalCamera(
                `${canvas.id}-camera`,
                position,
                scene
            );
        } else {
            camera = new BABYLON.FreeCamera(
                `${canvas.id}-camera`,
                position,
                scene
            );
        }

        camera.setTarget(target);
    }

    currentCamera = camera;
    scene.activeCamera = camera;

    await updateCameraInScene();

    currentCamera.attachControl(canvas, true);

    return currentCamera;
}

async function initScene() {
    if (scene) {
        return scene;
    }

    let camera = canvas.querySelector('arashtad-camera');

    if (!camera) {
        camera = document.createElement('arashtad-camera');
        camera.id = `${canvas.id}-camera`;
        camera.setAttribute(
            'type',
            document.getElementById('camera_type')?.value || 'ArcRotateCamera'
        );
        canvas.appendChild(camera);
    }

    scene = await ready(canvas);

    await updateClearColor();

    currentCamera = scene.activeCamera;

    if (currentCamera) {
        await updateCameraInScene();
        currentCamera.attachControl(canvas, true);
    }

    return scene;
}

// function toggleCameraFields() {
//     const type = document.getElementById('camera_type')?.value || '';

//     document.querySelectorAll('.arcrotate-field').forEach(el => {
//         el.style.display = type === 'ArcRotateCamera' ? '' : 'none';
//     });
// }

// function toggleAutoRotateFields() {
//     const checked = document.getElementById('use_auto_rotate')?.checked || false;

//     document.querySelectorAll('.auto-rotate-field').forEach(el => {
//         el.style.display = checked ? '' : 'none';
//     });
// }

function toggleCameraFields() {
    const type = document.getElementById('camera_type')?.value || '';

    document.querySelectorAll('.arcrotate-field:not(.auto-rotate-field)').forEach(el => {
        el.style.display = type === 'ArcRotateCamera' ? '' : 'none';
    });
}

function toggleAutoRotateFields() {
    const type = document.getElementById('camera_type')?.value || '';
    const checked = document.getElementById('use_auto_rotate')?.checked || false;

    document.querySelectorAll('.auto-rotate-field').forEach(el => {
        el.style.display = type === 'ArcRotateCamera' && checked ? '' : 'none';
    });
}

function addCameraChangeListeners() {
    const cameraFields = document.querySelectorAll(
        '.arashtad-camera-settings input, .arashtad-camera-settings select'
    );

    cameraFields.forEach(field => {
        field.addEventListener('change', async () => {
            try {
                if (field.id === 'camera_type') {
                    await rebuildCamera();
                } else {
                    await updateCameraInScene();
                }

                toggleCameraFields();
                toggleAutoRotateFields();
            } catch (error) {
                console.error('Failed to update camera:', error);
            }
        });

        field.addEventListener('input', debounce(async () => {
            try {
                if (field.id === 'camera_type') {
                    await rebuildCamera();
                } else {
                    await updateCameraInScene();
                }
            } catch (error) {
                console.error('Failed to update camera:', error);
            }
        }, 100));
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function createModel(url) {
    if (!canvas || !scene) return;

    setCanvasState(false);
    setPreloader(false);

    try {
        const runtime = canvas.querySelector('arashtad-runtime');
        const existingModel = runtime?.querySelector('arashtad-model');

        if (existingModel) {
            existingModel.remove();
        }

        const oldRoot = scene.getTransformNodeByName?.('arashtad-admin-model-root');
        if (oldRoot) {
            oldRoot.dispose();
        }

        model = null;

        if (!url) {
            setCanvasState(true);
            setPreloader(true);
            return;
        }

        model = await loadModel(scene, url, 'arashtad-admin-model');

        await updateModelInScene();

        setCanvasState(true);
        setPreloader(true);
    } catch (error) {
        console.error('Arashtad 3D Error:', error);
        setCanvasState(true);
        setPreloader(true);
    }
}

function setupModelLoadingObserver() {
    if (!canvas) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'MODEL' && node.id === 'arashtad-admin-model') {
                        // Check if model loaded successfully
                        node.addEventListener('load', () => {
                            setCanvasState(true);
                            setPreloader(true);
                        });
                        node.addEventListener('error', (e) => {
                            console.error('Model failed to load:', e);
                            setCanvasState(true);
                            setPreloader(true);
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(canvas, { childList: true, subtree: true });
}

function addModelChangeListeners() {
    modelInput?.addEventListener('change', () => {
        createModel(getSource());
    });

    selectButton?.addEventListener('click', () => {
        setCanvasState(false);
        setPreloader(false);

        const frame = wp.media({
            title: __('Select 3D Model', 'arashtad-3d-loader'),
            button: {
                text: __('Use This Model', 'arashtad-3d-loader')
            },
            multiple: false
        });

        frame.on('select', () => {
            const attachment = frame.state().get('selection').first().toJSON();

            if (!attachment?.url) return;

            modelInput.value = attachment.url;
            modelInput.dispatchEvent(new Event('change'));
        });

        frame.open();
    });

    clearButton?.addEventListener('click', () => {
        modelInput.value = '';
        modelInput.dispatchEvent(new Event('change'));
    });
}

function addWrapperStylesListeners() {
    const styleFields = document.querySelectorAll('[name^="arashtad_styles["]');
    styleFields.forEach(field => {
        field.addEventListener('change', () => {
            updateWrapperStyles();
        });
        field.addEventListener('input', debounce(() => {
            updateWrapperStyles();
        }, 100));
    });
}

function addClearColorListener() {
    const colorInput = document.querySelector('[name="arashtad_clear_color"]');
    if (!colorInput) return;
    colorInput.addEventListener('change', async () => {
        try {
            await updateClearColor();
            setCanvasState(true);
            setPreloader(true);
        } catch (error) {
            console.error('Failed to update clear color:', error);
        }
    });
    colorInput.addEventListener('input', debounce(async () => {
        try {
            await updateClearColor();
            setCanvasState(true);
            setPreloader(true);
        } catch (error) {
            console.error('Failed to update clear color:', error);
        }
    }, 200));
}

function copyShortcode(button, value) {
    navigator.clipboard.writeText(value).then(() => {
        const text = button.textContent;
        button.textContent = __('Copied', 'arashtad-3d-loader');
        setTimeout(() => {
            button.textContent = text;
        }, 1200);
    });
}

document.getElementById('arashtad_copy_shortcode')?.addEventListener('click', event => {
    copyShortcode(event.currentTarget, document.getElementById('arashtad_shortcode').value);
});

document.querySelectorAll('.arashtad-copy-shortcode').forEach(button => {
    button.addEventListener('click', () => {
        copyShortcode(button, button.dataset.shortcode);
    });
});

document.getElementById('arashtad-refresh-preview')?.addEventListener('click', async () => {
    try {
        setCanvasState(false);
        setPreloader(false);
        await reloadScene();
        setCanvasState(true);
        setPreloader(true);
    } catch (error) {
        console.error('Failed to refresh preview:', error);
        setCanvasState(true);
        setPreloader(true);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (!canvas) return;

    canvasWrapper = canvas.closest('.canvas-wrapper');
    
    addCameraChangeListeners();
    addLightChangeListeners();
    addModelChangeListeners();
    addModelSettingsListeners();
    addClearColorListener();
    addWrapperStylesListeners();
    toggleAutoRotateFields();
    toggleCameraFields();
    toggleLightFields();
    updateWrapperStyles();
    setupModelLoadingObserver();

    handlePanel();

    const initialModel = getSource();

    if (initialModel) {
        setTimeout(async () => {
            await initScene();
            await createModel(initialModel);
        }, 100);
    } else {
        setTimeout(async () => {
            await initScene();
            setCanvasState(true);
            setPreloader(true);
        }, 100);
    }

    renderMainForm();
    renderSidebar();
});

function renderMainForm() {
    const sidebar = document.getElementById('arashtad_main');
    if (!sidebar)
        return;

    [
        '#arashtad_3d_loader_preview'
    ].forEach(selector => {
        const box = document.querySelector(selector);
        if (box)
            sidebar.appendChild(box);
    });
}

function renderSidebar() {
    const sidebar = document.getElementById('arashtad_sidebar');
    if (!sidebar)
        return;
   

    const sidebarTop = document.getElementById('arashtad_sidebar_top');
    if (!sidebar)
        return;

    [
        '.wp-heading-inline',
        '.page-title-action',
        '#titlediv'
    ].forEach(selector => {
        const box = document.querySelector(selector);
        if (box)
            sidebarTop.appendChild(box);
    });

    const sidebarMiddle = document.getElementById('arashtad_meta_boxes');
    if (!sidebar)
        return;

    [
        '#arashtad_3d_loader_model',
        '#arashtad_3d_loader_shortcode',
        '#arashtad_3d_loader_styles',
        '#arashtad_3d_loader_clear_color',
        '#arashtad_3d_loader_model_settings',
        '#arashtad_3d_loader_camera',
        '#arashtad_3d_loader_light',
        '#arashtad_3d_loader_lazy',
        '#arashtad_3d_loader_resources'
    ].forEach(selector => {
        const box = document.querySelector(selector);
        if (box)
            sidebarMiddle.appendChild(box);
    });

    let modelBox = document.getElementById('arashtad_3d_loader_model');
    modelBox.classList.add('active');

    const sidebarBottom = document.getElementById('arashtad_sidebar_bottom');
    if (!sidebar)
        return;

    [
        '#submitdiv'
    ].forEach(selector => {
        const box = document.querySelector(selector);
        if (box)
            sidebarBottom.appendChild(box);
    });
}

function updatePosterSettings() {
    if (!posterEnabled || !posterSettings) return;
    posterSettings.classList.toggle('enabled', posterEnabled.checked);
}

posterEnabled?.addEventListener('change', updatePosterSettings);
updatePosterSettings();

selectPosterButton?.addEventListener('click', () => {
    if (!posterEnabled?.checked) return;
    if (!posterFrame) {
        posterFrame = wp.media({
            title: __('Select Poster Image', 'arashtad-3d-loader'),
            button: { text: __('Use Poster', 'arashtad-3d-loader') },
            multiple: false
        });
        posterFrame.on('select', () => {
            const attachment = posterFrame.state().get('selection').first().toJSON();
            if (!attachment) return;
            posterImageId.value = attachment.id;
            posterPreview.innerHTML = '';
            const image = document.createElement('img');
            image.src = attachment.url;
            image.className = 'arashtad-poster-preview-image';
            posterPreview.appendChild(image);
            posterPreview.classList.add('has-image');
            if (clearPosterButton) clearPosterButton.hidden = false;
        });
    }
    posterFrame.open();
});

clearPosterButton?.addEventListener('click', () => {
    posterImageId.value = '';
    posterPreview.innerHTML = '';
    posterPreview.classList.remove('has-image');
    clearPosterButton.hidden = true;
});


function handlePanel() {
    const tabs = document.querySelectorAll('#arashtad_panel_tab li');

    tabs.forEach(tabButton => {
        tabButton.addEventListener('click', () => {
            if (!tabButton.classList.contains('active')) {
                const tab = tabButton.id.slice(0, -7);

                tabs.forEach(tab => tab.classList.remove('active'));
                tabButton.classList.add('active');

                const activeBox = document.querySelector('#arashtad_meta_boxes .postbox.active');
                if (activeBox) {
                    activeBox.style.display = 'none';
                    activeBox.classList.remove('active');
                }

                const box = document.querySelector(`#arashtad_meta_boxes #${tab}`);
                if (box) {
                    box.style.display = 'block';
                    box.classList.add('active');
                }
            }
        });
    });

    const minorPublishing = document.querySelector('#minor-publishing');

    if (minorPublishing) {
        minorPublishing.addEventListener('click', event => {
            const rect = minorPublishing.getBoundingClientRect();

            if (event.clientY >= rect.top - 24 && event.clientY <= rect.top) {
                minorPublishing.classList.toggle('active');
            }
        });
    }
}