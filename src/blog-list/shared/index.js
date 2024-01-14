import Masonry from 'masonry-layout'
import apiFetch from '@wordpress/api-fetch';

export function list () {
  const DOM = {
    'container': null,
    'load_more_button':null
  }
  let masonryInstance
  let page = 1;
  function getMorePosts() {
    let dataSettings = DOM.container.getAttribute('data-settings');
    let { post_type, posts_per_page, total_pages } = JSON.parse(dataSettings);
    page++;

    // Add post type and posts per page parameters to the request
    const path = `/wp/v2/posts?post_type=${post_type}&per_page=${posts_per_page}&page=${page}&_embed`;

    apiFetch( { path } )
    .then(posts => {
      const postsHTML = posts.map(post => {
        // destructuring necessary post fields
        let { title, _embedded } = post;
        let thumbnailUrl = _embedded['wp:featuredmedia'] ? _embedded['wp:featuredmedia'][0].source_url : null;
        return `
      <div class="cm-tutorial-blog-list__item">
        <img src="${thumbnailUrl}" alt="${title.rendered}" />
        <h2>${title.rendered}</h2>
      </div>
    `;
      });
      // Converting HTML strings to Node
      const parser = new DOMParser();
      const postsNodeList = postsHTML.map(htmlString => {
        return parser.parseFromString(htmlString, 'text/html').body.firstChild;
      });

      // Appending DOM nodes to the container and Masonry instance
      postsNodeList.forEach(node => {
        DOM.container.appendChild(node);
        masonryInstance.appended(node);
      });

      setTimeout(function(){
        masonryInstance.layout();
      }, 300)

      if(page >= total_pages){
        DOM.load_more_button.remove()
      }

    })
    .catch(error => {
      // There was an error
      console.error( error );
    });
  }

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
    DOM.load_more_button = DOM.container.querySelector('.cm-tutorial-blog-list__load-more-button')
  }

  function handleLoadMore(e){
    e.preventDefault()
    getMorePosts()
  }

  function addEventListeners () {
    DOM.load_more_button.addEventListener('click', handleLoadMore)
  }

  function init (el) {
    if (el === null) return
    cacheDOM(el)
    addEventListeners()
    initMasonry()
  }

  return { init, masonryInstance }
}