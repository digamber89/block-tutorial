import masonryList from './shared/masonryList'

(function () {
  const items = document.querySelectorAll('.cm-tutorial-masonry')
  items.forEach((item) => {
    let masonryInstance = new masonryList()
    const { cmTutorialData } = window
    console.log(cmTutorialData)
    masonryInstance.init(item, cmTutorialData.ajaxURL)
  })
})()