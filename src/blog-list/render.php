<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>
<?php
$attributes = $attributes ?? [];
$settings   = $attributes['settings'] ?? [
	'post_type'      => 'post',
	'posts_per_page' => 10
];

$posts = new WP_Query(
	[
		'post_type'      => $settings['post_type'] ?? 'post',
		'posts_per_page' => $settings['posts_per_page'] ?? 10,
		'post_status'    => 'publish',
        'order' => 'ASC'
	]
);

$total_posts = $posts->found_posts;

// Calculate total number of pages
$total_pages = ceil( $total_posts / $settings['posts_per_page'] );

// Add total_pages to settings
$settings['total_pages'] = $total_pages;
?>
<div <?php echo get_block_wrapper_attributes(['class' => 'cm-tutorial-blog-list']); ?> data-settings='<?php echo esc_attr( json_encode( $settings ) ); ?>'>
	<?php
	if ( $posts->have_posts() ):
		?>
			<?php
			while ( $posts->have_posts() ): $posts->the_post();
				$thumbnail_id = get_post_thumbnail_id();
				?>
                <a class="cm-tutorial-blog-list__item" href="<?php echo get_the_permalink(); ?>">
					<?php
					echo wp_get_attachment_image( $thumbnail_id, 'medium' );
					printf( '<h2>%s</h2>', get_the_title() );
					?>
                </a>
			<?php
			endwhile;
			wp_reset_postdata(); ?>
            <div class="cm-tutorial-blog-list__pagination">
                <button class="cm-tutorial-blog-list__load-more-button button"><?php _e( 'Load more', 'tutorial' ) ?></button>
            </div>
	<?php
	else:
		echo '<h2>No Entries Found</h2>';
	endif;
	?>
</div>
