/**
 * constants.js
 * Configuration and constants for the AR Viewer
 */

const MODEL_CONFIG = {
    // Default model coordinates
    DEFAULT_COORDINATES: {
        latitude: 43.76729,
        longitude: 7.211510,
        altitude: 0
    },

    // Model definitions
    MODELS: {
        'obj-model': {
            key: 'obj-model',
            format: 'obj',
            scale: '1 1 1',
            rotation: '0 0 0',
            position: '0 0 0',
            description: 'modele 3D en format OBJ'
        },
        'gltf-model': {
            key: 'gltf-model',
            format: 'gltf',
            path: './model/gltf/result.gltf',
            scale: '1 1 1',
            rotation: '0 0 0',
            position: '0 0 0',
            name: 'GLTF Model',
            description: '3D model in GLTF format'
        }
    },

    // GPS and placement settings
    GPS_SETTINGS: {
        UPDATE_INTERVAL: 1000, // Minimum time between GPS updates (ms)
        MIN_ACCURACY: 10, // Minimum GPS accuracy in meters
        MODEL_OFFSET: {
            distance: 2, // meters in front of camera
            height: -0.5, // meters below camera
            lateral: 0.5 // meters to the right of camera
        }
    },

    // Scale factors for different modes
    SCALE_FACTORS: {
        MANUAL: 0.2,
        GPS: 0.2,
        MOBILE_REDUCTION: 0.2
    },

    // UI Settings
    UI_SETTINGS: {
        SCALE_SLIDER: {
            MIN: 0.1,
            MAX: 5,
            STEP: 0.1,
            DEFAULT: 1.0
        }
    }
};

// Export for use in other files
window.MODEL_CONFIG = MODEL_CONFIG; 