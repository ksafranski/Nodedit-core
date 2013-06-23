/**
 * @method nodedit.init
 * 
 * Start the application
 */
nodedit.init = function () {
    
    // Cache the main container
    nodedit.$el = $(nodedit.el);
    
    // Check sessions
    if (nodedit.session()) {
        // Session exists, start workspace
        nodedit.workspace.init();
    } else {
        // No session, show connect view
        nodedit.connect.view();
    }
    
    // Disable system context menu
    nodedit.$el.on('contextmenu', function () {
        return false;
    });
    
};

// Call app init
$(function(){
   
   nodedit.init();
   
});