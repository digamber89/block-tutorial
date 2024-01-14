import { useState } from '@wordpress/element'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from '@wordpress/components'
import { cancelCircleFilled, Icon } from '@wordpress/icons'
export function ImageManager ({ initialItems = [], onImagesSave }) {
  const [images, setImages] = useState(initialItems)
  const saveImages = () => {
    onImagesSave(images)
  }
  const handleDelete = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleAdd = () => {
    const newImage = { url: '', alt: '' }
    setImages(prevImages => [...prevImages, newImage])
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setImages(items)
  }

  const handleUrlChange = (newValue, index) => {
    const newImages = [...images]
    newImages[index]['url'] = newValue
    setImages(newImages)
  }

  const handleAltChange = (newValue, index) => {
    const newImages = [...images]
    newImages[index]['alt'] = newValue
    setImages(newImages)
  }

  return (<DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId="images">
      {(provided) => (<div className="cm-tutorial__images-editor" {...provided.droppableProps} ref={provided.innerRef}>
        {images.map((image, index) => (
          <Draggable key={index}
                     draggableId={`${index}`}
                     index={index}>
            {(provided) => (
              <div className="cm-tutorial__editor-image"
                   key={index}
                   {...provided.draggableProps}
                   {...provided.dragHandleProps}
                   ref={provided.innerRef}>
                <img className={"cm-tutorial__editor-image-preview"} src={image.url}  alt={image.alt}/>
                <div className="cm-tutorial__editor-image--url">
                  <label>URL</label>
                  <input type="text" value={image.url}
                         onChange={(e) => handleUrlChange(e.target.value, index)}/>
                </div>
                <div className="cm-tutorial__editor-image--alt-text">
                  <label>Alternate Text</label>
                  <input type="text" value={image.alt}
                         onChange={(e) => handleAltChange(e.target.value, index)}/>
                </div>
                <Button
                  onClick={() => handleDelete(index)}
                ><Icon icon={cancelCircleFilled} />Delete</Button>
              </div>
            )}
          </Draggable>))
        }
        {provided.placeholder} {/* This place to move items while dragging */}
        <div className="cm-tutorial__images-actions">
          <Button variant="primary" onClick={handleAdd}>Add New Image</Button>
          <Button variant="primary" onClick={saveImages}>Save</Button>
        </div>
      </div>)}
    </Droppable>
  </DragDropContext>)
}