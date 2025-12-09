<?php
/**
 * Plugin Name: Custom Block Plugin
 * Description: These are my custom blocks for the Gutenberg editor. Includes a newsletter, interactive carosel, comparison blocks, and a testimonial slider for interesting quotes.
 * Version: 1.0.0
 * Author: Gage W. Reed
 * License: GPLv2
 */


/*
* Register all blocks in the /blocks/ folder.
*/
function cbp_register_blocks() {
    if ( function_exists( 'register_block_type' ) ) {
        register_block_type( __DIR__ . '/blocks/newsletter-block' );
        // register_block_type( __DIR__ . '/blocks/interactive-gallery' );
        register_block_type( __DIR__ . '/blocks/comparison-columns' );
        register_block_type( __DIR__ . '/blocks/testimonial-slider' );
    }
}
add_action( 'init', 'cbp_register_blocks' );

function my_block_enqueue_scripts() {
    wp_enqueue_script(
        'my-block-toggle',
        plugin_dir_url(__FILE__) . 'blocks/newsletter-block/toggle-expanded.js',
        array(),
        '1.0.0',
        true
    );

    // wp_enqueue_script(
    //     'interactive-gallery-view',
    //     plugin_dir_url(__FILE__) . 'blocks/interactive-gallery/view.js',
    //     array(),
    //     '1.0.0',
    //     true
    // );
}
// Enqueue scripts on the frontend only (avoid running DOM code inside the editor)
add_action('wp_enqueue_scripts', 'my_block_enqueue_scripts');
