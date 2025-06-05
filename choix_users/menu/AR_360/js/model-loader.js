/**
 * model-loader.js
 * Utility to load and manage 3D models in different formats (OBJ, GLTF, IFC)
 * for AR Viewer
 */

class ModelLoader {
  constructor() {
    this.modelFormats = {};  // Registry of model formats
    this.currentFormat = null;
    this.currentModelKey = null;
    this.modelEntity = null;
    this.modelVisible = true;
    this.modelInfo = {};  // Initialize modelInfo object

    // Handlers for different formats
    this.formatHandlers = {
      obj: this.loadOBJModel.bind(this),
      gltf: this.loadGLTFModel.bind(this)
    };
  }

  /**
   * Initialize the model loader
   * @param {HTMLElement} modelEntity 
   */
  init(modelEntity,chantier) {
    this.modelEntity = modelEntity;
    this.setupEventListeners();

    
    // Initialize with models from constants
    Object.entries(MODEL_CONFIG.MODELS).forEach(([key, modelInfo]) => {
      this.addModelFormat(key, modelInfo.format, {
        path: '/chantiers/'+chantier+'/OBJ_model/representation_3d.obj',
        mtl: '/chantiers/'+chantier+'/OBJ_model/representation_3d.mtl',
        scale: modelInfo.scale,
        rotation: modelInfo.rotation,
        position: modelInfo.position,
        name: chantier,
        description: modelInfo.description
      });
    });

    // Set initial format and rotation from first model
    const firstModel = Object.values(MODEL_CONFIG.MODELS)[0];
    this.currentFormat = firstModel.format;
    this.currentModelKey = firstModel.key;
    this.modelEntity.setAttribute('rotation', firstModel.rotation);

    return this;
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    const toggleCheckbox = document.getElementById('toggleModel');
    if (toggleCheckbox) {
      toggleCheckbox.addEventListener('change', (e) => {
        this.toggleVisibility(e.target.checked);
      });
    }

    // Listen for model loaded event to hide loader
    this.modelEntity.addEventListener('model-loaded', () => {
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
          if (loader) loader.style.display = 'none';
        }, 600);
      }
    });

    // Listen for model error event
    this.modelEntity.addEventListener('model-error', (e) => {
      console.error('Error loading model:', e.detail);
    });
  }

  addModelFormat(key, format, modelInfo) {
    if (!this.formatHandlers[format]) {
      console.warn(`Unsupported format: ${format}`);
      return;
    }
    this.modelFormats[key] = { format, modelInfo };
  }

  /**
   * Load a model in the specified format
   */
  loadModel(key) {
    const entry = this.modelFormats[key];
    if (!entry) {
      console.error(`Model with key "${key}" not found`);
      return;
    }
    this.currentFormat = entry.format;
    this.currentModelKey = key;
    this.modelEntity.removeAttribute('gltf-model');
    this.modelEntity.removeAttribute('obj-model');
    return this.formatHandlers[entry.format](entry.modelInfo);
  }

  loadOBJModel(modelInfo) {
    this.modelEntity.setAttribute('obj-model', `obj: ${modelInfo.path}; mtl: ${modelInfo.mtl}`);
    this.applyCommonAttributes(modelInfo);
  }

  loadGLTFModel(modelInfo) {
    const gltfPath = `url(${modelInfo.path})`;
    this.modelEntity.setAttribute('gltf-model', gltfPath);
    this.applyCommonAttributes(modelInfo);
  }

  applyCommonAttributes(modelInfo) {
    // Use scale from modelInfo or default from constants
    const scale = modelInfo.scale || MODEL_CONFIG.SCALE_FACTORS.MANUAL;
    const rotation = modelInfo.rotation || '0 0 0';
    const position = modelInfo.position || '0 0 0';

    this.modelEntity.setAttribute('scale', scale);
    this.modelEntity.setAttribute('rotation', rotation);
    this.modelEntity.setAttribute('position', position);
    this.modelEntity.setAttribute('visible', this.modelVisible);
  }

  /**
   * Toggle model visibility
   * @param {boolean} visible - Whether the model should be visible
   */
  toggleVisibility(visible) {
    this.modelVisible = visible;
    if (this.modelEntity) {
      this.modelEntity.setAttribute('visible', visible);
    }
    return visible;
  }

  /**
   * Switch between different model formats
   * @param {string} key - The key of the model to switch to
   */
  switchFormat(key) {
    return this.loadModel(key);
  }

  /**
   * Get the current model information
   */
  getModelInfo() {
    const currentModel = this.modelFormats[this.currentModelKey];
    return {
      format: this.currentFormat,
      key: this.currentModelKey,
      visible: this.modelVisible,
      ...currentModel?.modelInfo
    };
  }

  // Get available model formats for dropdown
  getAvailableFormats() {
    return Object.entries(this.modelFormats).map(([key, value]) => ({
      key: key,
      format: value.format,
      path: value.modelInfo.path,
      name: value.modelInfo.name,
      description: value.modelInfo.description
    }));
  }
}

// Export for use in other files
window.ModelLoader = ModelLoader;
