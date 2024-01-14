import Masonry from 'masonry-layout'

export function list () {
  const DOM = {
    'container': null,
  }
  let masonryInstance

  function initMasonry () {
    masonryInstance = new Masonry(DOM.container, {
      itemSelector: '.cm-tutorial-blog-list__item',
      columnWidth: 200,
      gutter: 20,
    })
    masonryInstance.layout()
  }

  function cacheDOM (el) {
    DOM.container = el
  }

  function init (el) {
    if (el === null) return
    cacheDOM(el)
    initMasonry()
  }

  return { init, masonryInstance }
}