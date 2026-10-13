<?php

if (!defined('ABSPATH'))
    exit;

add_filter('script_loader_tag', 'arashtad_3d_loader_module_scripts', 10, 3);

function arashtad_3d_loader_register_assets()
{
    wp_register_script('arashtad-3d-loader-babylon', ARASHTAD_3D_LOADER_URL . 'lib/babylon/babylon.js', [], ARASHTAD_3D_LOADER_VERSION, true);
    wp_register_script('arashtad-3d-loader-loaders', ARASHTAD_3D_LOADER_URL . 'lib/babylon/loaders/babylonjs.loaders.min.js', ['arashtad-3d-loader-babylon'], ARASHTAD_3D_LOADER_VERSION, true);
    wp_register_script('arashtad-3d-loader-site', ARASHTAD_3D_LOADER_URL . 'var/js/site.js', ['arashtad-3d-loader-babylon', 'arashtad-3d-loader-loaders'], ARASHTAD_3D_LOADER_VERSION, true);
    wp_register_style('arashtad-3d-loader-site', ARASHTAD_3D_LOADER_URL . 'var/css/site.css', [], ARASHTAD_3D_LOADER_VERSION);
}

function arashtad_3d_loader_module_scripts($tag, $handle, $src)
{
    if ($handle === 'arashtad-3d-loader-site')
        return '<script type="module" src="' . esc_url($src) . '"></script>';  // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- Script is registered and enqueued through WordPress; this filter only adds the module type.

    return $tag;
}
