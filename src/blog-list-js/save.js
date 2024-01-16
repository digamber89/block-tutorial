/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import Template from './shared/Template'

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({attributes}) {
	const { settings } = attributes;
	return (
		<div { ...useBlockProps.save({
			className: 'cm-tutorial-masonry'
		}) }
		>
			<div className="cm-tutorial-masonry__items" data-settings={JSON.stringify(settings)}></div>
			<div className="cm-tutorial-masonry__pagination">
				<button className="cm-tutorial-masonry__load-more">Load More</button>
			</div>
			<Template/>
		</div>
	);
}
