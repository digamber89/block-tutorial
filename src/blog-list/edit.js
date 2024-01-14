/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor'

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss'
import { PanelBody, SelectControl, Spinner } from '@wordpress/components'
import { useSelect } from '@wordpress/data'
import ServerSideRender from '@wordpress/server-side-render'
import { useEffect, useRef, useState } from '@wordpress/element'
import { list } from './shared'

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {JSX.Element} Element to render.
 */
export default function Edit ({ attributes, setAttributes }) {
  const {settings} = attributes
  const [listInstance, setListInstance] = useState()
  const postTypes = useSelect((select) => {
    let options = select('core').getEntityRecords('root', 'postType')
    if (options) {
      return options.filter((option) => {
        if (option.viewable && option.slug !== 'attachment') return option
      })
    }
  }, [])
  const blockProps = useBlockProps();
  const postTypeOptions = postTypes ? postTypes.map((type) => ({ label: type.name, value: type.slug })) : []
  const itemRef = useRef(null)

  const handPostTypeChange = (post_type) => {
    setAttributes({settings: {...settings, post_type: post_type}})
  }

  useEffect(() => {
    if(itemRef.current){
     const listContainer = itemRef.current.querySelector('.cm-tutorial-blog-list')
      let newListInstance = list()
      setListInstance(newListInstance)
      newListInstance.init(listContainer)
    }
  }, [settings])

  return (
    <div {...blockProps} >
      <InspectorControls>
        <PanelBody title={'Settings'}>
          {postTypeOptions === [] && <Spinner/>}
          <SelectControl
            options={postTypeOptions}
            value={settings.post_type}
            onChange={handPostTypeChange}
          />
        </PanelBody>
      </InspectorControls>
      <div className="cm-tutorial-blog-list-editor" ref={itemRef}>
        <ServerSideRender
          block="tutorial/blog-list"
          attributes={attributes}
        />
      </div>
    </div>
  )
}
