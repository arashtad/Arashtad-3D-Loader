<?php

if (!defined('ABSPATH'))
    exit;

add_action('init', 'arashtad_3d_loader_register_block');

function arashtad_3d_loader_register_block()
{
    wp_register_script(
        'arashtad-3d-loader-block',
        ARASHTAD_3D_LOADER_URL . 'var/js/block.js',
        [
            'wp-blocks',
            'wp-element',
            'wp-components',
            'wp-data',
            'wp-i18n'
        ],
        ARASHTAD_3D_LOADER_VERSION,
        true
    );

    register_block_type('arashtad/loader', [
        'api_version' => 3,
        'editor_script' => 'arashtad-3d-loader-block',
        'title' => 'Arashtad 3D Loader',
        'description' => 'Insert an Arashtad 3D Loader.',
        'category' => 'media',
        'icon' => 'format-image',
        'attributes' => [
            'sceneId' => [
                'type' => 'number',
                'default' => 0
            ]
        ]
    ]);
}
