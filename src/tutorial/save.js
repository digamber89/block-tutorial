/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor'
import { ImageList } from './components/ImageList'

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {JSX.Element} Element to render.
 */
export default function save ({ attributes }) {
  const { introTextStyle, date, images } = attributes
  return (
    <div {...useBlockProps.save({
      className: 'cm-tutorial',
    })}>
      <h1 className="cm-tutorial__intro-text"
          style={introTextStyle}>{'Tutorial – hello from the saved content!'}</h1>
      <p className="cm-tutorial__date"
         data-date={date}></p>
      <ImageList images={images}/>
    </div>
  )
}
