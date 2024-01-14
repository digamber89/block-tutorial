export function ImageList ({ images = [] }) {
  return (<div className="cm-tutorial__images">
    {images.length > 0 && images.map((image, index) => {
      return <img key={index} className="cm-tutorial__image" src={image.url} alt={image.alt}/>
    })}
  </div>)
}