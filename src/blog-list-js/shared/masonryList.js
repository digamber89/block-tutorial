import Handlebars from 'handlebars'
import Masonry from 'masonry-layout'

export default function masonryList () {
  const DOM = {
    'container': null,
    'list': null,
    'load_more_button': null,
  }

  const Selectors = {
    'masonryItems': '.cm-tutorial-masonry__item',
    'listSelector': '.cm-tutorial-masonry__items',
    'load_more': '.cm-tutorial-masonry__load-more',

  }

  let current_page = 1
  let total_pages = 0

  let template = null
  let settings = {}
  let msnry = null

  function setupTemplating (scriptTag) {
    let templateString = scriptTag ? scriptTag.innerHTML : ''
    template = Handlebars.compile(templateString)
  }

  function renderHTML (item = {
    name: 'John Doe',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/John_Doe%2C_born_John_Nommensen_Duchac.jpg',
  }) {
    return template({
      item: item,
    })
  }

  function setTotalPages (total) {
    total_pages = total
  }

  function get_posts () {
    const { cmTutorialData } = window
    if (cmTutorialData === undefined) { console.warn('The URL is not specified. SAD')}
    const { ajaxURL } = cmTutorialData !== undefined ? cmTutorialData : { ajaxURL: '' }
    let params = new URLSearchParams()
    for (let key in settings) {
      params.append(key, settings[key])
    }
    params.append('page', current_page.toString())
    params.append('action', 'cm_get_posts')

    fetch(`${ajaxURL}?${params.toString()}`).then(response => response.json()).then(response => {
      if (response.success !== undefined && response.success) {
        const { items, total_pages } = response.data
        if (current_page >= total_pages) {
          DOM.load_more_button.remove()
        }
        setTotalPages(total_pages)
        renderList(items)
        current_page++
        msnry.layout()
      }
    }).catch(error => {
      console.error('Error:', error)
    })
  }

  function renderList (items) {
    // Converting HTML strings to Node
    const parser = new DOMParser();
    // Appending DOM nodes to the container and Masonry instance
    if (typeof items === 'object') {
      items.map((item) => {
        const htmlString = renderHTML(item)
        const node = parser.parseFromString(htmlString, 'text/html').body.firstChild;
        DOM.list.appendChild(node);
        msnry.appended(node);
        setTimeout(()=>{
          msnry.layout()
        }, 300)
      })
    }
  }

  function handle_load_more (e) {
    e.preventDefault()
    get_posts()
  }

  function addEventListeners () {
    console.log(DOM.load_more_button)
    DOM.load_more_button.addEventListener('click', handle_load_more)
  }

  function cacheDOM (el) {
    DOM.container = el
    DOM.list = DOM.container.querySelector(Selectors.listSelector)
    DOM.load_more_button = DOM.container.querySelector(Selectors.load_more)
    let scriptTag = DOM.container.querySelector('script')
    if (scriptTag !== null) {
      setupTemplating(scriptTag)
    }
    settings = JSON.parse(DOM.list.getAttribute('data-settings'))
    //initial request
    get_posts(settings)
    msnry = new Masonry( DOM.list, {
      // options
      itemSelector: Selectors.masonryItems,
      columnWidth: 200,
      gutter: 10
    });
  }

  function init (el = null) {
    if (el === null) return
    cacheDOM(el)
    addEventListeners()
  }

  return { init }
}