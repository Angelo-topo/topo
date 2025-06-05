/**
 * orbit-controls.js
 * Custom A-Frame component for orbit controls for AR models
 * 
 * @version 1.0
 */

AFRAME.registerComponent('orbit-controls', {  schema: {
    enabled: { default: true },
    target: { type: 'selector' },
    maxDistance: { default: 10 },
    minDistance: { default: 0.5 },
    rotateSpeed: { default: 1.0 },
    zoomSpeed: { default: 1.0 },
    enableDamping: { default: true },
    dampingFactor: { default: 0.1 }
  },
  init: function () {
    const el = this.el;
    this.camera = el.getObject3D('camera') || el.sceneEl.camera;
    this.target = this.data.target ? this.data.target.object3D : null;
    
    // Track the state of touch inputs
    this.isTouching = false;
    this.touchStarted = false;
    this.isPinching = false;
    this.fingerDistance = 0;
    this.lastTouchX = 0;
    this.lastTouchY = 0;
    this.orbit = { x: 0, y: 0 };
    this.touchPoints = [];
    this.currentDistance = 5; // Default distance
    
    // Set initial model position
    this.modelPosition = new THREE.Vector3();
    if (this.target) {
      this.target.getWorldPosition(this.modelPosition);
    }

    // Create UI toggle for orbit controls
    this.createToggleUI();
    
    // Bind event handlers
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    
    // Add event listeners
    if (this.data.enabled) {
      this.addEventListeners();
    }
    
    // Listen for model changes
    document.addEventListener('model-ready', this.onModelReady.bind(this));
    
    // Create orbit indicator
    this.createOrbitIndicator();
  },
  
  onModelReady: function(event) {
    // Update target reference when model changes
    if (this.data.target) {
      this.target = this.data.target.object3D;
      if (this.target) {
        this.target.getWorldPosition(this.modelPosition);
      }
    }
  },
  
  createOrbitIndicator: function() {
    // Create a visual indicator for when orbit controls are active
    const indicator = document.createElement('div');
    indicator.id = 'orbit-indicator';
    indicator.style.position = 'absolute';
    indicator.style.top = '50%';
    indicator.style.left = '50%';
    indicator.style.width = '50px';
    indicator.style.height = '50px';
    indicator.style.transform = 'translate(-50%, -50%)';
    indicator.style.borderRadius = '50%';
    indicator.style.border = '2px solid rgba(255, 255, 255, 0.5)';
    indicator.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    indicator.style.pointerEvents = 'none';
    indicator.style.display = 'none';
    indicator.style.zIndex = '1000';
    document.body.appendChild(indicator);
    
    this.orbitIndicator = indicator;
  },
  
  showOrbitIndicator: function() {
    if (this.orbitIndicator) {
      this.orbitIndicator.style.display = 'block';
      
      // Hide indicator after 1 second
      setTimeout(() => {
        if (this.orbitIndicator) {
          this.orbitIndicator.style.display = 'none';
        }
      }, 1000);
    }
  },
  
  createToggleUI: function() {
    // Create UI for orbit controls toggle
    const controlPanel = document.getElementById('control-panel');
    if (!controlPanel) return;
    
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'toggle-container';
    
    const label = document.createElement('label');
    label.htmlFor = 'toggleOrbit';
    label.textContent = 'Orbit Controls:';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'toggleOrbit';
    checkbox.checked = this.data.enabled;
    
    toggleContainer.appendChild(label);
    toggleContainer.appendChild(checkbox);
    controlPanel.appendChild(toggleContainer);
    
    // Add event listener to toggle
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        this.addEventListeners();
      } else {
        this.removeEventListeners();
      }
    });
  },
  
  addEventListeners: function() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('touchstart', this.onTouchStart);
      canvas.addEventListener('touchmove', this.onTouchMove);
      canvas.addEventListener('touchend', this.onTouchEnd);
      canvas.addEventListener('touchcancel', this.onTouchEnd);
    }
  },
  
  removeEventListeners: function() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.removeEventListener('touchstart', this.onTouchStart);
      canvas.removeEventListener('touchmove', this.onTouchMove);
      canvas.removeEventListener('touchend', this.onTouchEnd);
      canvas.removeEventListener('touchcancel', this.onTouchEnd);
    }
  },
    onTouchStart: function(evt) {
    if (!this.data.enabled || !this.target) return;
    
    // Check if model is visible before allowing orbit controls
    if (this.target && !this.target.visible) return;
    
    // Store touch points
    this.touchPoints = [];
    for (let i = 0; i < evt.touches.length; i++) {
      this.touchPoints.push({
        x: evt.touches[i].pageX,
        y: evt.touches[i].pageY
      });
    }
    
    // Show orbit indicator when starting to interact
    this.showOrbitIndicator();
    
    if (this.touchPoints.length === 1) {
      // Single touch = orbit
      this.touchStarted = true;
      // Store initial touch position for delta calculation
      this.lastTouchX = this.touchPoints[0].x;
      this.lastTouchY = this.touchPoints[0].y;
    } else if (this.touchPoints.length === 2) {
      // Two touches = pinch zoom
      this.isPinching = true;
      this.fingerDistance = Math.hypot(
        this.touchPoints[1].x - this.touchPoints[0].x,
        this.touchPoints[1].y - this.touchPoints[0].y
      );
    }
    
    // Prevent default to avoid unwanted scrolling
    evt.preventDefault();
  },
  
  onTouchMove: function(evt) {
    if (!this.data.enabled || !this.touchStarted && !this.isPinching || !this.target) return;
    
    // Check if model is visible before allowing orbit controls
    const modelVisible = this.target.visible;
    if (!modelVisible) return;
    
    const newTouchPoints = [];
    for (let i = 0; i < evt.touches.length; i++) {
      newTouchPoints.push({
        x: evt.touches[i].pageX,
        y: evt.touches[i].pageY
      });
    }
      if (this.touchStarted && newTouchPoints.length === 1) {
      // Calculate movement deltas
      const currentX = newTouchPoints[0].x;
      const currentY = newTouchPoints[0].y;
      
      // Calculate the difference between current position and last position
      const deltaX = currentX - this.lastTouchX;
      const deltaY = currentY - this.lastTouchY;
      
      // Apply rotation to model based on horizontal movement (deltaX)
      // Use deltaX for Y-axis rotation (horizontal swipe rotates around vertical axis)
      this.orbit.y += (deltaX * this.data.rotateSpeed * 0.01);
      
      // Optional: Use deltaY for X-axis rotation if you want vertical tilt
      // this.orbit.x += (deltaY * this.data.rotateSpeed * 0.01);
      
      // Update model rotation
      if (this.target) {
        this.target.rotation.y = this.orbit.y;
        // Uncomment if you want vertical tilt
        // this.target.rotation.x = this.orbit.x;
      }
      
      // Update last touch position for next move
      this.lastTouchX = currentX;
      this.lastTouchY = currentY;
    } else if (this.isPinching && newTouchPoints.length === 2) {
      // Calculate new distance for zooming
      const newFingerDistance = Math.hypot(
        newTouchPoints[1].x - newTouchPoints[0].x,
        newTouchPoints[1].y - newTouchPoints[0].y
      );
      
      // Calculate scale factor
      const scaleFactor = newFingerDistance / this.fingerDistance;
      this.fingerDistance = newFingerDistance;
      
      // Apply zooming
      this.currentDistance = Math.max(
        this.data.minDistance,
        Math.min(this.data.maxDistance, this.currentDistance / scaleFactor)
      );
      
      // Update model scale
      if (this.target) {
        const currentScale = this.target.scale.x;
        const newScale = currentScale * scaleFactor;
        const limitedScale = Math.max(0.1, Math.min(10, newScale));
        this.target.scale.set(limitedScale, limitedScale, limitedScale);
      }
    }
    
    // Prevent default to avoid unwanted scrolling
    evt.preventDefault();
  },
  
  onTouchEnd: function(evt) {
    this.touchStarted = false;
    this.isPinching = false;
    this.touchPoints = [];
  },
  
  update: function(oldData) {
    // Handle changes to component properties
    if (oldData.enabled !== this.data.enabled) {
      if (this.data.enabled) {
        this.addEventListeners();
      } else {
        this.removeEventListeners();
      }
    }
    
    // Update target reference if needed
    if (this.data.target && oldData.target !== this.data.target) {
      this.target = this.data.target.object3D;
      if (this.target) {
        this.target.getWorldPosition(this.modelPosition);
      }
    }
  },
  
  remove: function() {
    // Clean up event listeners when component is removed
    this.removeEventListeners();
    
    // Remove the UI toggle if it exists
    const toggle = document.getElementById('toggleOrbit');
    if (toggle) {
      const container = toggle.parentElement;
      if (container) {
        container.remove();
      }
    }
    
    // Remove orbit indicator
    if (this.orbitIndicator && this.orbitIndicator.parentNode) {
      this.orbitIndicator.parentNode.removeChild(this.orbitIndicator);
    }
  }
});