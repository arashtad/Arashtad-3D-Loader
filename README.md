# Arashtad 3D Loader (Mithra)

**Powerful Babylon.js 3D engine for WordPress.**

Display, animate, customize, and build interactive 3D experiences directly in WordPress with Arashtad 3D Loader. Create 3D product showcases, interactive scenes, presentations, configurators, and immersive experiences without writing your own rendering engine.

[![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/arashtad-3d-loader?label=WordPress.org)](https://wordpress.org/plugins/arashtad-3d-loader/)
[![WordPress Plugin Downloads](https://img.shields.io/wordpress/plugin/dt/arashtad-3d-loader)](https://wordpress.org/plugins/arashtad-3d-loader/)
[![License](https://img.shields.io/badge/License-GPL--2.0-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

**[WordPress.org](https://wordpress.org/plugins/arashtad-3d-loader/) | [Live Demo](https://demo.arashtad.com/categories/wordpress-development/wp/arashtad-3d-loader/) | [Documentation](https://doc.arashtad.com/docs/arashtad-3d-loader/) | [Pro Version](https://market.arashtad.com/product/arashtad-3d-loader/)**

---

## Overview

Arashtad 3D Loader (Mithra) brings the power of [Babylon.js](https://www.babylonjs.com/) to WordPress through an accessible scene editor and a dedicated runtime architecture.

Create and manage 3D scenes, configure cameras and lighting, display animated models, customize the canvas, and embed interactive experiences anywhere on your website.

The plugin integrates the **[Arashtad 3D Runtime (Oshida)](https://github.com/arashtad/Arashtad-3D-Runtime)**, a reusable runtime layer designed to support Arashtad's growing ecosystem of 3D WordPress applications.

### Key Features

* Optimized real-time 3D rendering
* Multiple 3D model formats
* Unlimited scenes
* Interactive camera controls
* Configurable lighting and canvas styling
* Model animation and autoplay
* Lazy loading and loading progress indicators
* Gutenberg block and shortcode support
* Responsive, mobile-ready viewer
* Advanced scene control and interactions in Pro
* AR, WebXR, and WooCommerce integration in Pro
* No telemetry or tracking

## Supported Technologies

* **Rendering engine:** Babylon.js
* **Runtime:** Arashtad 3D Runtime (Oshida)
* **Platform:** WordPress
* **Minimum WordPress version:** 6.0
* **Minimum PHP version:** 7.4
* **Current release:** 2.1.1

## Free Version Features

The Community version provides a complete foundation for creating responsive 3D model experiences in WordPress.

### Supported 3D Formats

* GLB
* GLTF
* GLTF 1.0
* OBJ
* STL
* PLY
* Compressed PLY
* SPLAT
* SPZ
* SOG
* `.babylon`

### Model Sources

* WordPress Media Library
* Internal URLs
* External URLs
* Multiple model sources

### Loading and Performance

* Optimized runtime
* Preloader
* Loading progress bar
* Loading percentage
* Lazy loading
* Multiple scenes on the same page

### Viewer Controls

* Automatic rotation
* Configurable rotation speed and delay
* Fullscreen mode
* Animation autoplay
* Mouse rotation
* Touch rotation
* Pan and zoom
* Responsive layout
* Mobile support
* Poster images
* Model downloads

### WordPress Integration

* Gutenberg block
* Shortcode
* Add Block integration
* Unlimited scenes per page
* Dedicated scene editor
* Live editor preview
* Guided setup
* Model file selection
* Model replacement and removal

### Camera Configuration

* Camera angle and positioning
* Alpha and beta rotation
* Camera radius
* Camera target
* Field of view (FOV)
* Minimum and maximum clipping planes

### Lighting

* Light positioning
* Light intensity
* Shadow intensity
* Exposure

### Canvas Styling

Customize the 3D canvas with controls for:

* Positioning and z-index
* Top, right, bottom, and left offsets
* Transform
* Margin and padding
* Width, maximum width, height, and maximum height
* Aspect ratio
* Border and border radius
* Overflow
* Box sizing
* Box shadow
* Outline

### Animation and Media

* Model animation autoplay
* Configurable allowed MIME types

## Pro Version

**Everything in Free, plus advanced 3D capabilities.**

[Explore Arashtad 3D Loader Pro](https://market.arashtad.com/product/arashtad-3d-loader/)

### Augmented Reality and WebXR

* Augmented Reality (AR)
* WebXR
* Desktop QR-to-AR experiences

### Advanced Scene Control

* Advanced styling
* Custom CSS for the canvas
* `.env` and `.hdr` environments
* Custom environment settings
* Per-scene triggers for custom functions
* JavaScript native events and action triggers
* Babylon.js native events and action triggers

### Advanced Mesh Interaction

* Babylon.js native events and triggers
* Per-model triggers for custom functions
* Per-mesh triggers for custom functions
* Per-mesh material customization
* Per-mesh texture customization
* `StandardMaterial`
* `PBRMaterial`
* Custom PBR material creator

Build interactive scenes where individual model parts have their own behavior, materials, textures, and actions.

### Advanced Lighting

* Multiple lights
* Multiple light types
* Light color and intensity
* Advanced shadow control

### Animation Control

* Animation selection
* Animation speed
* Start, stop, and pause controls

### Visual Effects

* Post-processing effects

### Visual Builders

* Combined 2D and 3D hero section blocks
* 3D advertising banner maker

### WooCommerce Integration

* WooCommerce product integration
* 3D product galleries
* 3D model placement above or below product images
* Product image and gallery replacement with 3D models
* Multiple models per product
* Per-variation models

Create product pages where customers can explore products interactively in real time.

## What Can You Build?

Arashtad 3D Loader can grow from a simple model viewer into a complete interactive 3D application.

Use it to create:

* 3D product visualizations
* Interactive product showcases
* Product configurators
* 3D presentations
* Interactive models
* 3D hero sections
* Advertising experiences
* Animated models
* Interactive WooCommerce products
* AR experiences
* WebXR experiences
* Custom 3D applications

A typical workflow is simple:

**Upload → Configure → Publish**

Then expand your scene with custom camera controls, lighting, animation, materials, interactions, and visual effects.

## Architecture: Powered by Oshida

Arashtad 3D Loader integrates the **Arashtad 3D Runtime (Oshida)**, a reusable runtime layer that provides a foundation for building Babylon.js-powered experiences.

The runtime and its plugin system help separate core runtime functionality from higher-level application features.

This architecture supports the development of additional tools and applications across the Arashtad 3D ecosystem.

* **Runtime source code:** [Arashtad-3D-Runtime on GitHub](https://github.com/arashtad/Arashtad-3D-Runtime)
* **Runtime license:** MIT
* **WordPress plugin license:** GPL-2.0

## Performance

Arashtad 3D Loader is designed for efficient rendering and flexible scene management.

* Optimized runtime architecture
* Lazy loading for improved initial page loading
* Loading progress indicators
* Support for multiple scenes on the same page
* Responsive layouts for desktop and mobile devices

Actual rendering performance depends on model complexity, textures, scene configuration, browser capabilities, and the user's hardware.

## Privacy

**Private by default.**

The Community version does not use telemetry or tracking and does not intentionally transmit visitor or usage data to an external service.

* No telemetry
* No tracking
* No hidden analytics requests

Babylon.js and its GLTF loader are bundled locally with the plugin. The unused KTX2 decoder containing fallback URLs to the Babylon.js CDN has been removed.

The Pro version connects to the Arashtad API server only for license validation and plugin update requests. These requests transmit license-related information, not website content or visitor data.

### Third-Party References

* [Babylon.js Website](https://www.babylonjs.com/)
* [Babylon.js Source Code and License](https://github.com/BabylonJS/Babylon.js)
* [Babylon.js Terms of Use](https://forum.babylonjs.com/tos)
* [Babylon.js Privacy Policy](https://forum.babylonjs.com/privacy)

## Installation

### Install from WordPress.org

1. Open **Plugins → Add New Plugin** in your WordPress administration panel.
2. Search for **Arashtad 3D Loader**.
3. Install and activate the plugin.
4. Open the Arashtad 3D Loader settings.
5. Create a new 3D scene and select or upload a model.
6. Insert the scene into a page or post using the Gutenberg block or shortcode.

**[Install from WordPress.org](https://wordpress.org/plugins/arashtad-3d-loader/)**

### Manual Installation

1. Download the plugin from [WordPress.org](https://wordpress.org/plugins/arashtad-3d-loader/).
2. Extract the `arashtad-3d-loader` directory into `wp-content/plugins/`.
3. Activate the plugin through the WordPress Plugins screen.
4. Create and configure your first 3D scene.

## Frequently Asked Questions

### Does the Community version require an external service?

No. The Community version runs on your own WordPress server and does not intentionally connect to external services for its core functionality.

### Where can I find the runtime source code?

The Arashtad 3D Runtime (Oshida) is available on GitHub under the MIT License.

[View the runtime repository](https://github.com/arashtad/Arashtad-3D-Runtime)

### Which 3D model formats are supported?

GLB, GLTF, GLTF 1.0, OBJ, STL, PLY, Compressed PLY, SPLAT, SPZ, SOG, and `.babylon`.

### Is the Community version fully functional?

Yes. It provides a complete foundation for responsive 3D model viewing, scene creation, camera configuration, basic lighting, and unlimited scenes. Pro adds advanced functionality.

### Does it support mobile devices?

Yes. The viewer supports responsive layouts, touch rotation, panning, and zooming.

### Does it support WooCommerce?

WooCommerce integration, 3D galleries, product image replacement, and per-variation models are available in Pro.

### Does it support AR and WebXR?

Yes. AR, WebXR, and desktop QR-to-AR functionality are available in Pro.

## Changelog

### 2.1.1

* Bundled Babylon.js library assets locally.
* Removed external fallback URLs for Babylon.js assets.

### 2.1.0

* Upgraded Arashtad 3D Runtime (Oshida) to v1.1.0.

### 2.0.0

* Integrated Arashtad 3D Runtime (Oshida) v1.0.0.
* Integrated Arashtad 3D Runtime plugins v1.0.0.
* Refactored the plugin to use the runtime and its plugin system.
* Migrated from direct Babylon.js usage to runtime-supported syntax.
* Restructured the plugin architecture around the runtime plugin system.

### 1.0.0

* Initial release.

## Links

* **WordPress.org:** https://wordpress.org/plugins/arashtad-3d-loader/
* **Demo:** https://demo.arashtad.com/categories/wordpress-development/wp/arashtad-3d-loader/
* **Documentation:** https://doc.arashtad.com/docs/arashtad-3d-loader/
* **Pro Marketplace:** https://market.arashtad.com/product/arashtad-3d-loader/
* **Arashtad 3D Runtime (Oshida):** https://github.com/arashtad/Arashtad-3D-Runtime

## License

Arashtad 3D Loader is licensed under the GNU General Public License v2.0 or later.

See [LICENSE](https://www.gnu.org/licenses/gpl-2.0.html) for details.

