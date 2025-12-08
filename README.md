# HDR/EXR 360 Viewer

<div align="center">

![HDR/EXR 360 Viewer](https://img.shields.io/badge/VS%20Code-1.106.1+-007ACC?logo=visualstudiocode)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-0.0.20-blue)

A professional VS Code extension for interactive 360-degree visualization of HDR and EXR files with real-time exposure control and WebGL acceleration.

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Keyboard Shortcuts](#keyboard-shortcuts) • [Advanced Features](#advanced-features) • [Troubleshooting](#troubleshooting)

</div>

---

<img width="1919" height="974" alt="Screenshot 2025-12-08 191429" src="https://github.com/user-attachments/assets/60944da9-63f7-459d-9285-8e83ca246ba1" />

---

## Features

✨ **Core Capabilities**
- 🌐 **360-Degree Spherical Viewer**: Immersive environment map visualization with full mouse interaction
- 🎨 **HDR Support**: High dynamic range image viewing with ACES Filmic tone mapping
- 📸 **OpenEXR Support**: Professional VFX format support with proper color space handling
- ⚙️ **Real-Time Exposure Control**: Dynamic exposure adjustment (-5 to +5 EV range) to reveal shadow and highlight details
- 🖱️ **Intuitive Controls**: Optimized mouse and keyboard interaction for seamless navigation
- ⚡ **GPU-Accelerated Rendering**: Hardware-accelerated WebGL with Three.js for smooth, responsive performance

🎯 **Professional Features**
- **SRGB Color Space**: Proper color management for accurate HDR representation
- **Auto-Rotation Mode**: Automated camera rotation for hands-free viewing
- **Zoom Control**: Smooth scrollwheel zoom with momentum damping
- **2D Fallback**: Graceful degradation with canvas-based 2D image display
- **Error Handling**: Comprehensive error messages and fallback rendering

---

## Installation

### 🔧 From VS Code Marketplace (Recommended)

1. Open VS Code
2. Go to **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"HDR/EXR 360 Viewer"**
4. Click **Install**

### 📦 Install from VSIX File

```bash
code --install-extension Mehanth.hdr-exr-360-viewer-0.0.20.vsix
```

### 🛠️ Build from Source

```bash
# Clone the repository
git clone https://github.com/Itz-mehanth/VSCE.git
cd VSCE

# Install dependencies
npm install

# Build the extension
npm run compile

# Package as VSIX
npm run package

# Install the generated VSIX
code --install-extension Mehanth.hdr-exr-360-viewer-0.0.20.vsix --force
```

---

## Quick Start

1. **Open a File**: Open any `.hdr` or `.exr` file in VS Code
2. **Auto-Display**: The 360 viewer opens automatically in the editor
3. **Interact**: Use mouse and keyboard controls to navigate (see shortcuts below)
4. **Adjust**: Use the exposure slider in the top-right corner to optimize brightness

---

## Usage Guide

### Basic Navigation

| Action | Control |
|--------|---------|
| **Rotate View** | Click and drag with mouse |
| **Zoom In/Out** | Scroll wheel or trackpad |
| **Pan** | Right-click and drag (if available) |
| **Auto-Rotate** | Press `Space` to toggle |
| **Reset View** | Press `R` to center camera |

### Advanced Controls

**Exposure Adjustment**
- Use the slider in the top-right to adjust exposure
- Range: -5 to +5 EV (Exposure Value)
- Real-time preview of changes

**Camera Behavior**
- **Momentum Damping**: Smooth deceleration when rotating
- **Auto-Rotation Speed**: Adjustable via code (default: 2x)
- **Field of View**: 75° default (optimized for HDR viewing)

---

## Keyboard Shortcuts

| Key | Action | Details |
|-----|--------|---------|
| <kbd>Space</kbd> | Toggle Auto-Rotation | Starts/stops automatic camera rotation around the Y-axis |
| <kbd>R</kbd> | Reset Camera | Returns to default view (camera at origin, facing forward) |
| <kbd>Mouse Drag</kbd> | Rotate | Left-click and drag to orbit the environment |
| <kbd>Scroll</kbd> | Zoom | Zoom in and out smoothly |

---

## Supported File Formats

### HDR (Radiance Format)
- **Extension**: `.hdr`
- **MIME Type**: `image/vnd.radiance`
- **Use Case**: Environment maps, light probes, atmospheric imaging
- **Color Space**: RGB, linear light
- **Max Resolution**: Unlimited (performance-dependent)

### OpenEXR
- **Extension**: `.exr`
- **MIME Type**: `image/x-exr`
- **Use Case**: Professional VFX, 3D rendering, scientific imagery
- **Color Space**: Linear RGB, support for various channel layouts
- **Compression**: Supported (ZIP, RLE, etc.)

---

## Advanced Features

### Tone Mapping
The extension uses **ACES Filmic tone mapping** for professional-grade HDR visualization:
- Preserves highlights and shadows
- Maintains color accuracy
- Suitable for color-critical work

### PMREM (Pre-filtered Mipmapped Radiance Environment Mapping)
- Automatically generates mipmaps for efficient rendering
- Reduces specular aliasing
- Optimizes performance for large environments

### Color Management
- **Output Color Space**: sRGB (matches monitor calibration)
- **Proper Gamma Correction**: Ensures accurate visual representation
- **Linear Workflow**: Internally uses linear color space for calculations

---

## Performance Optimization

### Rendering Settings
- **Anti-aliasing**: Enabled (smooth edges)
- **Pixel Ratio**: Native device pixel ratio (sharp on all displays)
- **Format**: WebGL (automatic fallback to 2D canvas if needed)

### Tips for Optimal Performance
1. **Large Files**: Files over 5MB may take longer to load
2. **Resolution**: Up to 8K environments supported (GPU-dependent)
3. **Memory**: Typically uses 100-500MB per image
4. **CPU**: Minimal CPU usage once loaded (GPU-driven)

---

## Troubleshooting

### Issue: Viewer shows dark/black screen

**Solution:**
1. Check that the file is a valid HDR or EXR image
2. Adjust the exposure slider (top-right)
3. Verify file is not corrupted: try opening in external viewer (Marmoset Toolbag, Substance Designer, etc.)
4. Check console for errors: `Ctrl+Shift+I` > **Console** tab

### Issue: File won't open

**Troubleshooting Steps:**
1. Verify file extension is `.hdr` or `.exr` (case-insensitive)
2. Check file is not corrupted
3. Try renaming file if it has special characters
4. Restart VS Code

### Issue: Poor Performance / Low FPS

**Optimization Steps:**
1. Reduce file resolution (re-save at lower dimensions)
2. Update GPU drivers
3. Close other GPU-intensive applications
4. Check VS Code GPU acceleration is enabled

### Issue: Colors look wrong

**Troubleshooting:**
1. Verify your monitor is calibrated correctly
2. Check tone mapping is working (exposure slider should affect brightness)
3. Compare with external HDR viewer for reference
4. Try different tone mapping: modify source code `THREE.ACESFilmicToneMapping`

### Get Help

Open the **Developer Console** for diagnostic information:
- **Windows/Linux**: `Ctrl+Shift+I`
- **macOS**: `Cmd+Shift+I`
- Navigate to **Console** tab to view logs

---

## System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **VS Code** | 1.106.1 | Latest stable |
| **GPU Memory** | 512 MB | 2 GB+ |
| **WebGL** | WebGL 2.0 | WebGL 2.0 |
| **OS** | Windows 7+ / macOS 10.13+ / Linux | Modern OS |
| **Browser Engine** | Chromium 90+ | Chromium 100+ |

**Browser Support:**
- Chrome/Chromium 90+
- Edge 90+
- Firefox 88+ (WebGL 2.0 support)

---

## Configuration

### VS Code Settings (Optional)

Add to `settings.json` for custom behavior:

```json
{
  "hdrExr360Viewer.defaultExposure": 0,
  "hdrExr360Viewer.autoRotateSpeed": 2,
  "hdrExr360Viewer.enableAutoRotate": false
}
```

---

## Extension Details

| Property | Value |
|----------|-------|
| **Publisher** | Mehanth |
| **ID** | `Mehanth.hdr-exr-360-viewer` |
| **Version** | 0.0.20 |
| **License** | MIT |
| **Repository** | [GitHub](https://github.com/Itz-mehanth/VSCE) |
| **Main Runtime** | Node.js + Chromium (Electron) |
| **Renderer** | WebGL via Three.js r160 |

---

## Development

### Building Locally

```bash
# Development build (watch mode)
npm run watch

# Production build
npm run package

# Run tests
npm test

# Type checking
npm run check-types

# Linting
npm run lint
```

### Project Structure

```
src/
├── extension.ts          # Extension entry point & custom editor provider
└── webview.ts            # Webview viewer implementation (Three.js)

media/
├── webview-bundle.js     # Bundled webview script (generated)
├── three.module.js       # Three.js library
├── OrbitControls.js      # Camera controller
├── RGBELoader.js         # HDR file loader
├── EXRLoader.js          # EXR file loader
└── fflate.module.js      # Compression library for EXR

dist/
└── extension.js          # Compiled extension (generated)
```

### Dependencies

- **Three.js**: WebGL rendering engine
- **OrbitControls**: Interactive camera control
- **RGBELoader**: HDR file parsing
- **EXRLoader**: OpenEXR file parsing
- **fflate**: Compression support for EXR files

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Support

- 📧 **Issues**: [GitHub Issues](https://github.com/Itz-mehanth/VSCE/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Itz-mehanth/VSCE/discussions)
- 📚 **Documentation**: See this README

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

### Latest (v0.0.20)
- ✅ Fixed CSP policy for data URL support
- ✅ Bundled webview as IIFE for stability
- ✅ Added 2D fallback viewer
- ✅ Improved error handling and diagnostics
- ✅ Production-ready release

---

## Credits

Built with:
- **Three.js** - 3D graphics library
- **VS Code Extension API** - Extension framework
- **Open Source Community** - Supporting libraries

---

<div align="center">

Made with ❤️ by [Mehanth](https://github.com/Itz-mehanth)

[⬆ back to top](#hdrexr-360-viewer)

</div>
