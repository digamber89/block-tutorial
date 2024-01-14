import { InspectorControls, useBlockProps } from '@wordpress/block-editor'
import { PanelBody, SelectControl, Spinner, __experimentalNumberControl as NumberControl } from '@wordpress/components'
import { useSelect } from '@wordpress/data'
import ServerSideRender from '@wordpress/server-side-render'
import { useEffect, useRef } from '@wordpress/element'
import { list } from './shared'

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
  const itemRef = useRef(null);

  const handlePostTypeChange = (post_type) => {
    setAttributes({settings: {...settings, post_type: post_type}})
  }

  const handlePostsPerPageChange = (posts_per_page) => {
    setAttributes({settings: {...settings, posts_per_page: posts_per_page}})
  }

  const TriggerWhenLoadingFinished = ({attributes}) => {
    return ( {children, showLoader} ) => {
      useEffect( () => {
        // Call action when the loading component unmounts because loading is finished.
        return () => {
          if (itemRef.current){
            const listContainer = itemRef.current.querySelector('.cm-tutorial-blog-list')
            let newListInstance = list()
            newListInstance.init(listContainer)
          }
        };
      }, [itemRef, attributes]);

      return (
        <div style={{position: 'relative'}}>
          {showLoader && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-9px',
                marginLeft: '-9px',
              }}
            >
              <Spinner />
            </div>
          )}
          <div style={{opacity: showLoader ? '0.3' : 1}}>
            {children}
          </div>
        </div>
      );
    };
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={'Settings'}>
          {postTypeOptions === [] && <Spinner/>}
          <SelectControl
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
          />
        </PanelBody>
      </InspectorControls>
      <div className="cm-tutorial-blog-list-editor" ref={itemRef}>
        <ServerSideRender
          block="tutorial/blog-list"
          attributes={attributes}
          LoadingResponsePlaceholder={TriggerWhenLoadingFinished({ attributes })}
        />
      </div>
    </div>
  )
}