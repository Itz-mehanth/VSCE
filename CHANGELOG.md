# Change Log

All notable changes to the "HDR/EXR 360 Viewer" extension will be documented in this file.

See [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

---

## [0.0.20] - 2025-12-05 (Production Release)

### ✨ Major Features
- **IIFE Bundle Format**: Switched from ESM to IIFE for improved compatibility and stability
- **Enhanced CSP Policy**: Added `connect-src data: blob:` to properly support data URL loading
- **2D Fallback Viewer**: Graceful degradation with canvas-based image display when WebGL fails
- **Comprehensive Error Handling**: Detailed error messages and diagnostics logging

### 🐛 Bug Fixes
- Fixed 403 Forbidden error when loading bundled webview script
- Resolved CSP violations for data URL fetch operations
- Fixed module import failures in webview context
- Corrected color space handling for SRGB output

### 🎯 Improvements
- Improved startup performance with bundled script approach
- Better error messages for end users
- Enhanced console logging for debugging
- Optimized bundle size and load times

### 📚 Documentation
- Created comprehensive production-level README
- Added detailed troubleshooting guide
- Included system requirements and compatibility matrix
- Added advanced features documentation

---

## [0.0.15] - 2025-12-05

### 🔧 Technical Updates
- Added diagnostic console logging to webview bundle
- Implemented TypeScript DOM type support in tsconfig.json
- Added @ts-ignore directives for Three.js imports

### 🎨 UI Improvements
- Info panel displays file name and usage tips
- Exposure control panel with real-time feedback
- Keyboard shortcuts display in status bar

---

## [0.0.14] - 2025-12-05

### ✨ New Features
- Initial webview bundling with esbuild
- Created separate esbuild-webview.js configuration
- Bundle all Three.js dependencies into single file

### 🔧 Build System
- Added `build:webview` npm script
- Integrated webview build into main compile pipeline
- Automated webview-bundle.js generation

---

## [0.0.12] - 2025-12-05

### ✨ New Features
- Custom editor provider for .hdr and .exr files
- Three.js-based 360 viewer with OrbitControls
- Real-time exposure adjustment slider
- Keyboard shortcuts (Space, R)
- ACES Filmic tone mapping for HDR

### 🎯 Supported Formats
- `.hdr` - Radiance HDR format
- `.exr` - OpenEXR format with compression support

### 🔧 Technical Stack
- Three.js r160.0 for WebGL rendering
- OrbitControls for camera manipulation
- RGBELoader for HDR file parsing
- EXRLoader for OpenEXR support
- fflate for EXR decompression

---

## [0.0.1-0.0.11] - Early Development

### Initial Development
- Extension scaffolding with Yeoman
- Basic custom editor setup
- File reading and base64 conversion
- VSIX packaging and deployment
- Iterative bug fixes and improvements

---

## Known Issues

- Very large files (>100MB) may take longer to load
- Some color calibration issues may occur on uncalibrated monitors
- Performance depends on GPU capabilities

## Future Enhancements

- [ ] Support for additional image formats (PNG, JPEG, TGA)
- [ ] Batch file conversion tools
- [ ] Custom shader support
- [ ] HDR metadata viewing
- [ ] Integration with VS Code color picker
- [ ] Preset exposure/tone mapping profiles
- [ ] WebP and AVIF format support
