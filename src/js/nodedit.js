/**
 * Creates the application object and initial configuration
 * @namespace nodedit
 */
var nodedit = {

    templates: "templates/",
    
    el: "#nodedit",
    
    /**
     * Initializes application
     * @method nodedit.init
     */

    init: function () {
        // Check sessions
        if (nodedit.session()) {
            // Session exists, start workspace
            nodedit.workspace.init();
        } else {
            // No session, show connect view
            nodedit.connect.view();
        }
        // Init plugins
        nodedit.plugins.init();
    }

};

// Starts app on page load
$(function(){ 

    // Cache the main container
    nodedit.$el = $(nodedit.el);
    
    // Determine environment (dist or src)
    nodedit.env = $("body").attr("data-env");
    
    // If dist env, load templates into DOM
    if (nodedit.env==="dist") {
        $.get("dist/templates/system.tpl", function (tpls) {
            $("body").append("<div id=\"nodedit-templates\">"+tpls+"</div>");
        }).done(function () {
            // call init after we have populated the templates inline.
            nodedit.init();
        });
    } else {
        nodedit.init();
    }

});

// Filter by data
$.fn.filterByData = function(prop, val) {
    return this.filter(
        function() { return $(this).data(prop)==val; } // Note, needs to be '==' not '==='
    );
};
