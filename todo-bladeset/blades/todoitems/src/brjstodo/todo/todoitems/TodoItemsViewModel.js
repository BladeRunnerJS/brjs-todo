var br = require( 'br/Core' );
var ServiceRegistry = require( 'br/ServiceRegistry' );
var PresentationModel = require( 'br/presenter/PresentationModel' );
var DisplayField = require( 'br/presenter/node/DisplayField' );
var NodeList = require( 'br/presenter/node/NodeList' );
var TodoViewModel = require( './TodoViewModel' );

function TodoViewItemsViewModel() {
  this.todos = new NodeList( [] );

  // get the event hub
  this.eventHub = ServiceRegistry.getService( 'br.event-hub' );

  // register to recieve events
  this.eventHub.channel( 'todo-list' ).on( 'todo-added', this._todoAdded, this );
}
br.extend( TodoViewItemsViewModel, PresentationModel );

TodoViewItemsViewModel.prototype._todoAdded = function( added ) {

  // create a new field for the new item
  var todoViewModel = new TodoViewModel( added );

  // get the existing items
  var nodes = this.todos.getPresentationNodesArray();

  // append the new item to the array
  nodes.push( todoViewModel );

  // update the View Model which triggers a UI update
  this.todos.updateList( nodes );
};

TodoViewItemsViewModel.prototype.remove = function( data, event ) {
  var nodes = this.todos.getPresentationNodesArray();
  var updatedNodes = [];
  nodes.forEach( function( node ) {
    if( node !== data ) {
      updatedNodes.push( node );
    }
  } );

  this.todos.updateList( updatedNodes );
};

module.exports = TodoViewItemsViewModel;