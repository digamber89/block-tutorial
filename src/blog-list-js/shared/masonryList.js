import Handlebars from 'handlebars'

export default function masonryList () {
  const DOM = {
    'container': null,
    'list': null,
  }

  const Selectors = {
    'masonryItems': '.cm-masonry-items',
    'listSelector': '.cm-tutorial-masonry__items',
  }

  let current_page = 1
  let total_pages = 0

  let template = null
  let settings = {}

  function init (el = null) {
    if (el === null) return
    cacheDOM(el)
  }

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

    if (total_pages === current_page) {

    }

    fetch(`${ajaxURL}?${params.toString()}`).then(response => response.json()).then(response => {
      if (response.success !== undefined && response.success) {
        const { items, total_pages } = response.data
        setTotalPages(total_pages)
        renderList(items)
      }
    }).catch(error => {
      console.error('Error:', error)
    })
  }

  function cacheDOM (el) {
    DOM.container = el
    DOM.list = DOM.container.querySelector(Selectors.listSelector)
    let scriptTag = DOM.container.querySelector('script')
    if (scriptTag !== null) {
      setupTemplating(scriptTag)
    }
    settings = JSON.parse(DOM.list.getAttribute('data-settings'))
    //initial request
    get_posts(settings)
  }

  function renderList (items) {
    let html = ''
    if (typeof items === 'object') {
      items.map((item) => {
        html += renderHTML(item)
      })
      DOM.list.innerHTML = html
    }
  }

  return { init }
}