/*
<!-- <h4>Normal event</h4>

<section
  respond-to-mouseenter
  respond-to-mouseleave
  class="display-4">
  <p>
    Move the mouse pointer on me!
  </p>
</section> -->
 */

(function() {


  // ---
  // Module declaraton
  // ---


  angular.module( "app", [] );


  // ---
  // Controllers
  // ---


  angular
    .module( "app" )
    .controller( "AppController", AppController );

  AppController.$inject = [];

  function AppController() {
    this.pathname = window.location.pathname;
  }


  // ---
  // Directives
  // ---


  /**
   * Respond to mouseenter event.
   */
  angular
    .module( "app" )
    .directive( "respondToMouseenter", respondToMouseenter );

  function respondToMouseenter() {
    return link;

    function link( scope, element ) {
      element.bind( "mouseenter", function() {
        element.children( ':first' ).html( "Welcome!" );
        element.css( "background-color", "#ff70ca" );
      })
    }
  }
  /**
   * Respond to mouseleave event.
   */
  angular
    .module( "app" )
    .directive( "respondToMouseleave", respondToMouseleave );

  function respondToMouseleave() {
    return link;

    function link( scope, element ) {
      element.bind( "mouseleave", function() {
        element.children( ':first' ).html( "Good-bye!" );
        element.css( "background-color", "#caff70" );
      })
    }
  }
})()
