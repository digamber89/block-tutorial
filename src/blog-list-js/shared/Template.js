/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Template() {
  return ( <script type="text/x-handlebars-template">
    <div className="cm-tutorial-masonry__item">
      <img className="cm-tutorial-masonry__item-image" src="{{item.image}}" alt="{{item.name}}"/>
      <h2 className="cm-tutorial-masonry__item-title">{'{{item.name}}'}</h2>
    </div>
  </script>)
}