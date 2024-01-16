<?php
/**
 * Plugin Name:       Tutorial
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       tutorial
 *
 * @package           create-block
 */

defined( 'ABSPATH' ) || exit;
/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function tutorial_block_init() {
	register_block_type( __DIR__ . '/build/tutorial' );
	register_block_type( __DIR__ . '/build/blog-list' );
	// Extended block type registration
	register_block_type( __DIR__ . '/build/blog-list-js' );

}

add_action( 'init', 'tutorial_block_init' );


function cm_tutorial_get_posts() {
	$post_type      = filter_input( INPUT_GET, 'post_type' );
	$posts_per_page = filter_input( INPUT_GET, 'posts_per_page' );
	$page           = filter_input( INPUT_GET, 'page' );

	$args  = [
		'post_type'      => $post_type,
		'posts_per_page' => $posts_per_page,
		'paged'          => $page ?? 1
	];
	$items = new WP_Query( $args );
	$response = [
		'items'       => [],
		'total_pages' => $page
	];

	if ( $items->have_posts() ) {
		while ( $items->have_posts() ): $items->the_post();
			$response['items'][] = [
				'name'  => get_the_title(),
				'image' => wp_get_attachment_image_url( get_post_thumbnail_id(), 'large' )
			];
		endwhile;
		wp_reset_postdata();
	}

	//will write code ignore for now
	wp_send_json_success( $response );
}

add_action( 'wp_ajax_cm_get_posts', 'cm_tutorial_get_posts' );


add_action( 'wp_enqueue_scripts', function () {
	wp_localize_script( 'tutorial-blog-list-js-view-script', 'cmTutorialData', [
		'ajaxURL' => admin_url( 'admin-ajax.php' ),
	] );
} );
