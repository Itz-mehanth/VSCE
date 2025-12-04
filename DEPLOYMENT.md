# Deployment Guide - HDR/EXR 360 Viewer Extension

## Current Status ✅

Your VS Code extension has been successfully created and packaged!

**Package Location**: `c:\React Projects\VSEx\hdr-exr-360-viewer-0.0.1.vsix`

## Installation Options

### Option 1: Install Locally (For Testing)

```powershell
code --install-extension "c:\React Projects\VSEx\hdr-exr-360-viewer-0.0.1.vsix"
```

After installation, restart VS Code and try opening the included `citrus_orchard_road_puresky_1k.hdr` file.

### Option 2: Publish to VS Code Marketplace (Official)

To publish your extension to the official marketplace:

1. **Create a Publisher Account**:
   - Go to https://marketplace.visualstudio.com
   - Click "Create Publisher"
   - Sign in with Microsoft account
   - Create a new publisher profile

2. **Generate Personal Access Token (PAT)**:
   - Go to https://dev.azure.com
   - Create a Personal Access Token with "Marketplace (publish)" scope
   - Keep this token secure

3. **Login to VSCE**:
   ```powershell
   cd 'c:\React Projects\VSEx'
   vsce login publisher-name
   # Paste your PAT when prompted
   ```

4. **Publish**:
   ```powershell
   vsce publish
   ```
   
   Or publish a specific version:
   ```powershell
   vsce publish patch  # Auto-increments patch version
   vsce publish minor  # Auto-increments minor version
   vsce publish 0.1.0  # Publish as specific version
   ```

5. **Publish Pre-release** (optional):
   ```powershell
   vsce publish --pre-release
   ```

### Option 3: Share the VSIX File

The `.vsix` file can be directly shared and installed by others:

```powershell
# Recipient can install with:
code --install-extension path/to/hdr-exr-360-viewer-0.0.1.vsix
```

## Prerequisites for Publishing

Before publishing to marketplace, ensure:

1. ✅ Update `package.json` with a repository URL:
   ```json
   "repository": {
     "type": "git",
     "url": "https://github.com/yourusername/hdr-exr-360-viewer"
   }
   ```

2. ✅ Add a LICENSE file (MIT is included in the template)

3. ✅ Update the version number in `package.json` if re-publishing

## File Structure

```
c:\React Projects\VSEx\
├── src/
│   ├── extension.ts          # Main extension logic
│   └── test/
│       └── extension.test.ts
├── dist/
│   └── extension.js          # Compiled output
├── media/                    # (Optional) For images in README
├── package.json             # Extension manifest
├── README.md                # Documentation
├── CHANGELOG.md             # Version history
├── tsconfig.json            # TypeScript config
├── esbuild.js              # Build configuration
└── hdr-exr-360-viewer-0.0.1.vsix  # Packaged extension
```

## Testing Before Deployment

### Test Locally

1. Open the project in VS Code
2. Press `F5` to start debugging
3. A new VS Code window opens with the extension loaded
4. Open any `.hdr` or `.exr` file to test

### Generate Test Image

If you don't have an EXR/HDR file:
- Use the included `citrus_orchard_road_puresky_1k.hdr` 
- Or download free HDR images from:
  - [Poly Haven](https://polyhaven.com/hdris)
  - [HDRi Haven](https://www.hdri-haven.com)

## Future Updates

To update your extension:

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with changes
3. **Run tests**: `npm test`
4. **Build**: `npm run package`
5. **Package**: `vsce package`
6. **Publish**: `vsce publish`

## Troubleshooting

### Extension won't load
```powershell
# Check for errors
npm run compile

# Verify package.json syntax
npm run check-types
```

### VSIX too large
- The included `.hdr` file inflates the package
- Remove it before publishing to marketplace
- Update `.vscodeignore` to exclude test files

### Can't load HDR/EXR files
- Ensure file paths are correct in webview
- Check browser console (in VS Code debug tools)
- Verify Three.js CDN is accessible

## Support & Resources

- **VS Code Extension Guide**: https://code.visualstudio.com/docs/extensions/overview
- **Publishing Guide**: https://code.visualstudio.com/docs/extensions/publish-extension
- **Three.js Docs**: https://threejs.org/docs
- **WebGL Best Practices**: https://www.khronos.org/opengl/wiki/

## Next Steps

1. **Test the extension locally** with the included HDR file
2. **Create a GitHub repository** for version control
3. **Set up CI/CD** for automated testing and builds
4. **Prepare marketplace listing** with screenshots/GIFs
5. **Publish to marketplace** when ready

---

**Questions?** Check the troubleshooting section above or consult VS Code documentation.
