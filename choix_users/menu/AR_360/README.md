# AR Viewer - Version 1.1 (June 2, 2025)

## Features

- View 3D models (OBJ) in augmented reality
- GPS-based or manual placement of models
- Interactive orbit controls (rotate and zoom)
- Scale control slider for precise sizing
- Directional arrow to locate models
- Distance calculation between user and model

## Latest Improvements

- Added orbit controls for models (single finger rotate, two-finger zoom)
- Fixed model scaling issues in GPS mode
- Added visual scale control slider
- Improved directional arrow visibility
- Added orbit controls information panel
- Fixed other minor issues

## Instructions

### Setup

1.  Ensure you have a web server to serve the files (e.g., using `python -m http.server` or VS Code's Live Server extension).
2.  Make sure your device has GPS capabilities and that location services are enabled.
3.  Open the `index.html` file in a web browser on your mobile device.

### Usage

1.  **Model Selection:** Use the model format dropdown to select between available 3D models (OBJ, GLTF).
2.  **Placement Mode:**
    *   **GPS Mode:** The model will automatically be placed at your initial GPS location. Ensure you have good GPS signal.
    *   **Manual Mode:** Tap on the screen to place the model at the desired location.
3.  **Scaling:** Use the scale slider to adjust the size of the model.
4.  **Orbit Controls:** Interact with the model using touch gestures:
    *   **Single Finger:** Rotate the model.
    *   **Two Fingers:** Pinch to zoom in/out.
5.  **Directional Arrow:** Follow the arrow to find the model's location if you move away from it.
6.  **GPS Accuracy:** Ensure your GPS accuracy is within a reasonable range for best placement results.

### Troubleshooting

*   **Model Not Loading:** Check the browser console for any errors related to model loading. Ensure the model paths in `model-loader.js` are correct.
*   **GPS Issues:** Make sure your device has a clear view of the sky and that location services are enabled.
*   **Performance:** For better performance, use optimized models and ensure your device meets the minimum requirements for AR.

---

![Our Services](./images/contact_developer.jpg)