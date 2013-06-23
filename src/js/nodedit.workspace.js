/**
 * @object nodedit.workspace
 * 
 * Used to manage the nodedit workspace (filemanager and editor) loading
 */
nodedit.workspace = {
    
    /**
     * @method nodedit.workspace.init
     * 
     * Starts up the workspace after a successful session is establshed
     */
    init: function () {
        
        // Ensure the session
        if (nodedit.session()) {
            // Load the workspace
            nodedit.template('workspace.tpl')
                .done(function (tmpl) {
                    // Load DOM
                    nodedit.$el.html(tmpl);
                    // Start filemanager
                    nodedit.filemanager.init();
                });
        } else {
            nodedit.message.error('Could not load session');
        }
        
    }
    
};