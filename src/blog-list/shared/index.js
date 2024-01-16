import Masonry from 'masonry-layout'
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';


export function list () {
  const DOM = {
    'container': null,
    'load_more_button':null
  }
  let masonryInstance
  let page = 1;
  let dataSettings = null
  function getMorePosts() {

    console.log(dataSettings)
    let { post_type, posts_per_page, total_pages } = JSON.parse(dataSettings);
    page++;

    // Add post type and posts per page parameters to the request
    const baseUrl = '/wp/v2/posts';
    const args = {
      post_type: post_type,
      per_page: posts_per_page,
      page: page,
      _embed: true,
      order: 'asc'
    };

    const path = addQueryArgs(baseUrl, args);
    apiFetch( { path } )
    .then(posts => {
      const postsHTML = posts.map(post => {
        // destructuring necessary post fields
        let { title, _embedded, link } = post;
        let thumbnailUrl = _embedded['wp:featuredmedia'] ? _embedded['wp:featuredmedia'][0].source_url : null;
        return `
      <a class="cm-tutorial-blog-list__item" href="${link}">
        <img src="${thumbnailUrl}" alt="${title.rendered}" />
        <h2>${title.rendered}</h2>
      </a>
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
      gutter: 2,
    })
    masonryInstance.layout()
  }

  function cacheDOM (el) {
    DOM.container = el
    DOM.load_more_button = DOM.container.querySelector('.cm-tutorial-blog-list__load-more-button')
    dataSettings = DOM.container.getAttribute('data-settings');
  }

  function handleLoadMore(e){
    e.preventDefault()
    getMorePosts()
  }

  function addEventListeners () {
    DOM.load_more_button.addEventListener('click', handleLoadMore)
  }

  function init (el) {
    console.log(el)
    if (el === null) return
    cacheDOM(el)
    addEventListeners()
    initMasonry()
  }

  return { init, masonryInstance }
}