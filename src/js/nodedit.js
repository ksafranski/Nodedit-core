/**
 * @object nodedit
 * 
 * Creates the application object and initial configuration
 */
var nodedit = {

    templates: 'templates/',
    
    el: '#nodedit'

};

// Starts app on page load
$(function(){ 

    // Cache the main container
    nodedit.$el = $(nodedit.el);
    
    // Determine environment (dist or src)
    nodedit.env = $('body').attr('data-env');
    
    // If dist env, load templates into DOM
    if (nodedit.env==='dist') {
        $.get('dist/templates/system.tpl', function (tpls) {
            $('body').append('<div id="nodedit-templates">'+tpls+'</div>');
        });
    }
    
    // Check sessions
    if (nodedit.session()) {
        // Session exists, start workspace
        nodedit.workspace.init();
    } else {
        // No session, show connect view
        nodedit.connect.view();
    }

});

// Filter by data
$.fn.filterByData = function(prop, val) {
    return this.filter(
        function() { return $(this).data(prop)==val; }
    );
};