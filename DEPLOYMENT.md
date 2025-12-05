# Production Deployment & Setup Guide

## Overview

This guide provides step-by-step instructions for deploying the HDR/EXR 360 Viewer extension to production environments.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Git**
- **Visual Studio Code** 1.106.1+
- **VSCE CLI** for packaging

### Install Dependencies

```bash
# Install global tools
npm install -g vsce @vscode/vsce-cli

# Verify installations
node --version  # v18.x or higher
npm --version   # 9.x or higher
vsce --version  # 2.x or higher
```

---

## Build Process

### 1. Clone Repository

```bash
git clone https://github.com/Itz-mehanth/VSCE.git
cd VSCE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Extension

```bash
# Build with TypeScript checking and linting
npm run compile

# Or directly package for production
npm run package
```

### Build Output

- **Extension File**: `dist/extension.js` (5-6 KB compiled)
- **Webview Bundle**: `media/webview-bundle.js` (1.3 MB bundled)
- **Type Definitions**: Generated from TypeScript

---

## Packaging

### Generate VSIX File (Production)

```bash
# Create production VSIX package
npx vsce package --out Mehanth.hdr-exr-360-viewer-0.0.20.vsix

# Verify package contents
unzip -l Mehanth.hdr-exr-360-viewer-0.0.20.vsix
```

### Package Contents

Expected structure:
```
├─ [Content_Types].xml
├─ extension.vsixmanifest
└─ extension/
   ├─ DEPLOYMENT.md
   ├─ LICENSE.txt
   ├─ SETUP_COMPLETE.md
   ├─ changelog.md
   ├─ esbuild-webview.js
   ├─ install.bat
   ├─ install.ps1
   ├─ package.json
   ├─ readme.md
   ├─ .github/
   │  └─ workflows/
   ├─ dist/
   │  └─ extension.js [5.31 KB]
   └─ media/
      ├─ EXRLoader.js [53.69 KB]
      ├─ OrbitControls.js [30.25 KB]
      ├─ RGBELoader.js [11.11 KB]
      ├─ fflate.module.js [81.34 KB]
      ├─ three.module.js [1.21 MB]
      └─ webview-bundle.js [1.31 MB]
```

### Size Optimization

| Component | Size | Status |
|-----------|------|--------|
| **VSIX Total** | ~547 KB | ✅ Optimized |
| **Webview Bundle** | 1.31 MB | ✅ Bundled |
| **Three.js** | 1.21 MB | ✅ Included |
| **Extension Code** | 5.31 KB | ✅ Minimal |

---

## Installation Methods

### Option 1: Direct VSIX Installation

```bash
# Install from local VSIX file
code --install-extension Mehanth.hdr-exr-360-viewer-0.0.20.vsix --force

# Install with specific VS Code instance
code --install-extension ./Mehanth.hdr-exr-360-viewer-0.0.20.vsix

# Uninstall if needed
code --uninstall-extension Mehanth.hdr-exr-360-viewer
```

### Option 2: Install from Marketplace

```bash
# Search in VS Code Extensions panel or use CLI
code --install-extension Mehanth.hdr-exr-360-viewer
```

### Option 3: GitHub Release Distribution

```bash
# Download from GitHub releases and install
$latest = "https://github.com/Itz-mehanth/VSCE/releases/download/v0.0.20/..."
code --install-extension $latest
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Run full test suite: `npm test`
- [ ] Verify linting passes: `npm run lint`
- [ ] Check types compile: `npm run check-types`
- [ ] Build webview bundle: `npm run build:webview`
- [ ] Package VSIX: `npm run package`
- [ ] Verify VSIX contents
- [ ] Test with sample HDR/EXR files
- [ ] Update VERSION in package.json
- [ ] Update CHANGELOG.md
- [ ] Create git tag: `git tag v0.0.20`

### Deployment

- [ ] Push to GitHub main branch
- [ ] Create GitHub Release
- [ ] Upload VSIX artifact
- [ ] Publish to VS Code Marketplace (if applicable)
- [ ] Update documentation links
- [ ] Announce release

### Post-Deployment

- [ ] Monitor for user reports
- [ ] Track extension telemetry
- [ ] Respond to issues promptly
- [ ] Plan next release if needed

---

## System Configuration

### Windows Setup

**Using PowerShell (Recommended)**

```powershell
# Run installer script
.\install.ps1

# Or manually install
code --install-extension .\Mehanth.hdr-exr-360-viewer-0.0.20.vsix --force
```

**Using Command Prompt**

```bash
# Install extension
code --install-extension Mehanth.hdr-exr-360-viewer-0.0.20.vsix --force

# Add to PATH if needed
setx PATH "%PATH%;C:\Program Files\Microsoft VS Code\bin"
```

### macOS Setup

```bash
# Install extension
code --install-extension Mehanth.hdr-exr-360-viewer-0.0.20.vsix --force

# Update VS Code if needed
softwareupdate -i -a
```

### Linux Setup

```bash
# Debian/Ubuntu
sudo apt-get install code

# Install extension
code --install-extension Mehanth.hdr-exr-360-viewer-0.0.20.vsix --force

# Or use snap
snap install --classic code
```

---

## Performance Tuning

### VS Code Configuration

Add to `.vscode/settings.json`:

```json
{
  "editor.renderWhitespace": "none",
  "editor.smoothScrolling": true,
  "editor.mouseWheelZoom": true,
  "hdrExr360Viewer.defaultExposure": 0,
  "hdrExr360Viewer.autoRotateSpeed": 2,
  "[hdr]": {
    "editor.defaultFormatter": "Mehanth.hdr-exr-360-viewer"
  },
  "[exr]": {
    "editor.defaultFormatter": "Mehanth.hdr-exr-360-viewer"
  }
}
```

### GPU Optimization

For optimal performance:

1. **Enable Hardware Acceleration** in VS Code
   - File > Preferences > Settings
   - Search: `gpu`
   - Enable "Webgl: Enabled"

2. **Update Graphics Drivers**
   - Windows: nvidia.com, amd.com
   - macOS: Software Update
   - Linux: Graphics vendor update

3. **Monitor Performance**
   - Open DevTools: `Ctrl+Shift+I`
   - Performance tab for FPS monitoring

---

## Troubleshooting Deployment

### Issue: Extension Won't Install

**Check:**
```bash
# Verify VSIX integrity
unzip -t Mehanth.hdr-exr-360-viewer-0.0.20.vsix

# Check VS Code version
code --version

# Ensure compatibility
code --list-extensions
```

**Solution:**
```bash
# Clean install
code --uninstall-extension Mehanth.hdr-exr-360-viewer
code --install-extension ./Mehanth.hdr-exr-360-viewer-0.0.20.vsix --force
```

### Issue: Files Don't Open

1. Verify file associations:
   ```bash
   # Check file type registration
   file -b sample.hdr
   file -b sample.exr
   ```

2. Check VS Code configuration:
   ```json
   // Add to settings.json
   "files.associations": {
     "*.hdr": "hdrExr360Viewer",
     "*.exr": "hdrExr360Viewer"
   }
   ```

### Issue: Poor Performance

1. **Monitor Resource Usage:**
   ```bash
   # Windows Task Manager
   tasklist /v | find "code"
   
   # macOS Activity Monitor
   top -o MEM
   
   # Linux top/htop
   htop -p $(pgrep code)
   ```

2. **Reduce Image Size:**
   - Re-save at lower resolution
   - Compress using ImageMagick: `convert in.hdr -resize 50% out.hdr`

3. **Enable Lazy Loading:**
   - Configure VS Code to load extensions on-demand

---

## Quality Assurance

### Automated Testing

```bash
# Run unit tests
npm test

# Type checking
npm run check-types

# Linting
npm run lint

# Full validation
npm run pretest
```

### Manual Testing Checklist

- [ ] Open `.hdr` file → Viewer opens automatically
- [ ] Open `.exr` file → Viewer opens automatically
- [ ] Rotate using mouse drag → Camera rotates smoothly
- [ ] Scroll wheel → Zoom works
- [ ] Press Space → Auto-rotation toggles
- [ ] Press R → Camera resets
- [ ] Adjust exposure slider → Changes brightness
- [ ] Very large file → Loads without crashing
- [ ] Corrupted file → Shows error gracefully
- [ ] Dark image → Exposure adjustment helps

---

## Monitoring & Analytics

### Extension Telemetry

Track usage via VS Code built-in telemetry:
- Extension activation events
- File type usage statistics
- Performance metrics
- Error reporting

### User Support

**Common Questions:**
1. **Q: Which HDR format is best?**
   A: Both HDR and EXR are supported. EXR is preferred for professional workflows.

2. **Q: Can I edit files?**
   A: This is a viewer. Use external tools (Photoshop, Substance Designer) for editing.

3. **Q: How do I report a bug?**
   A: GitHub Issues: https://github.com/Itz-mehanth/VSCE/issues

---

## Rollback Plan

If issues arise after deployment:

```bash
# Uninstall current version
code --uninstall-extension Mehanth.hdr-exr-360-viewer

# Install previous working version
code --install-extension ./Mehanth.hdr-exr-360-viewer-0.0.19.vsix --force

# Notify users via GitHub release notes
```

---

## Future Roadmap

- **v0.0.21**: Performance optimizations
- **v0.0.22**: Additional image format support
- **v0.0.23**: Custom shader support
- **v0.1.0**: Metadata viewer
- **v0.2.0**: Batch conversion tools

---

## Contact & Support

- **GitHub**: https://github.com/Itz-mehanth/VSCE
- **Issues**: https://github.com/Itz-mehanth/VSCE/issues
- **Author**: [Mehanth](https://github.com/Itz-mehanth)

---

## License

MIT License - See LICENSE file for details

---

<div align="center">

Made with ❤️ by Mehanth

[⬆ back to top](#production-deployment--setup-guide)

</div>
