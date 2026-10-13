<?php

/**
 * Plugin Name: Arashtad 3D Loader
 * Plugin URI: https://arashtad.com/arashtad-3d-loader
 * Description: Display interactive Babylon.js 3D models in WordPress.
 * Version: 2.1.1
 * Author: Arashtad
 * Author URI: https://arashtad.com
 * License: GPL-2.0
 * Text Domain: arashtad-3d-loader
 */
if (!defined('ABSPATH'))
    exit;

define('ARASHTAD_3D_LOADER_VERSION', '2.1.1');
define('ARASHTAD_3D_LOADER_FILE', __FILE__);
define('ARASHTAD_3D_LOADER_DIR', plugin_dir_path(__FILE__));
define('ARASHTAD_3D_LOADER_URL', plugin_dir_url(__FILE__));

// Load JavaScript translations
add_action('admin_enqueue_scripts', 'arashtad_3d_loader_load_js_translations');

function arashtad_3d_loader_load_js_translations()
{
    wp_set_script_translations(
        'arashtad-admin',
        'arashtad-3d-loader',
        ARASHTAD_3D_LOADER_DIR . 'languages'
    );

    wp_set_script_translations(
        'arashtad-3d-loader-block',
        'arashtad-3d-loader',
        ARASHTAD_3D_LOADER_DIR . 'languages'
    );
}

require_once ARASHTAD_3D_LOADER_DIR . 'opt/admin.php';
require_once ARASHTAD_3D_LOADER_DIR . 'opt/loader.php';
require_once ARASHTAD_3D_LOADER_DIR . 'opt/shortcode.php';
require_once ARASHTAD_3D_LOADER_DIR . 'opt/block.php';
require_once ARASHTAD_3D_LOADER_DIR . 'opt/site.php';
