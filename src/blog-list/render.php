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

$posts      = new WP_Query(
	[
		'post_type'      => $settings['post_type'] ?? 'post',
		'posts_per_page' => $settings['posts_per_page'] ?? 10,
		'post_status'    => 'publish'
	]
)

?>
<div <?php echo get_block_wrapper_attributes( [ 'class' => 'cm-tutorial-blog-list' ] ); ?>>
	<?php
	if ( $posts->have_posts() ):
		while ( $posts->have_posts() ): $posts->the_post();
			$thumbnail_id = get_post_thumbnail_id();
			?>
            <div class="cm-tutorial-blog-list__item">
				<?php
				echo wp_get_attachment_image( $thumbnail_id, 'medium' );
				the_title();
				?>
            </div>
		<?php
		endwhile;
		wp_reset_postdata();
	else:
		echo '<h2>No Entries Found</h2>';
	endif;
	?>
</div>
