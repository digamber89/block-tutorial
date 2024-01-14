/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n'

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { BlockControls, InspectorControls, useBlockProps } from '@wordpress/block-editor'

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss'
import { ColorPicker, DatePicker, PanelBody, ToolbarButton } from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'
import { ImageManager } from './components/ImageManager'
import { useDispatch } from '@wordpress/data'
import { ImageList } from './components/ImageList'
import { gallery } from '@wordpress/icons'

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {JSX.Element} Element to render.
 */
export default function Edit ({ attributes, setAttributes, isSelected }) {
  const { introTextStyle, date, images } = attributes
  const blockProps = useBlockProps({
    className: 'cm-tutorial',
  })
  const { savePost } = useDispatch('core/editor')
  const [editImages, setEditImages] = useState(false)

  function handleDateChange (newDate) {
    setAttributes({ date: newDate })
  }

  function handleColorChange (newColor) {
    setAttributes({
      introTextStyle: { ...introTextStyle, color: newColor },
    })
  }

  function handleSaveImages (newImages) {
    setAttributes({
      images: newImages,
    })
    savePost()
  }

  function toggleEditImages(){
    setEditImages(!editImages)
  }

  useEffect(() => {
    console.log(attributes)
  }, [])

  return (
    <div {...blockProps}>
      <InspectorControls group={'settings'}>
        <PanelBody>
          <ColorPicker
            onChange={(newColor) => { handleColorChange(newColor)}}
          />
          <DatePicker onChange={(newDate) => {
            handleDateChange(newDate)
          }}/>
        </PanelBody>
      </InspectorControls>
      <BlockControls>
        <ToolbarButton
          icon={ gallery } // Your chosen icon
          label="Edit Images"
          onClick={ toggleEditImages }
        />
      </BlockControls>
      <p className="cm-tutorial__intro-text"
         style={introTextStyle}>
        {__('Tutorial – hello from the editor!', 'tutorial')}
      </p>
      {date}
      {editImages && <ImageManager initialItems={images} onImagesSave={handleSaveImages}/>}
      {!editImages && <ImageList images={images}/>}
    </div>
  )
}
