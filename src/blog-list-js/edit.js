import { InspectorControls, useBlockProps } from '@wordpress/block-editor'
import { PanelBody, SelectControl, Spinner, __experimentalNumberControl as NumberControl } from '@wordpress/components'
import { useSelect } from '@wordpress/data'
export default function Edit ({ attributes, setAttributes }) {
  const {settings} = attributes
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

  const handlePostTypeChange = (post_type) => {
    setAttributes({settings: {...settings, post_type: post_type}})
  }

  const handlePostsPerPageChange = (posts_per_page) => {
    setAttributes({settings: {...settings, posts_per_page: posts_per_page}})
  }

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={'Settings'}>
          {postTypeOptions === [] && <Spinner/>}
          <SelectControl
            label={"Select Post Type"}
            options={postTypeOptions}
            value={settings.post_type}
            onChange={handlePostTypeChange}
          />
          <NumberControl
            isShiftStepEnabled={ true }
            min={1}
            onChange={ handlePostsPerPageChange }
            shiftStep={ 1 }
            value={ settings.posts_per_page }
            label={"Posts per Page"}
          />
        </PanelBody>
      </InspectorControls>
      <div className="cm-tutorial-masonry-edit">
        HELLO SELECT ME
      </div>
    </div>
  )
}