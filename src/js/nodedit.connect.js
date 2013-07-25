/**
 * Handles loading of the connection view and processing of form submission
 * @namespace nodedit.connect
 */
nodedit.connect = {
    
    /**
     * Loads the connect template and handles form submission
     * @method nodedit.connect.view
     */
    view: function () {
        nodedit.template("connect.tpl")
            .done(function (tmpl) {
                // Load DOM
                nodedit.$el.html(tmpl);
                // Bind submission
                $("form#connect").on("submit", function (e) {
                    e.preventDefault();
                    nodedit.connect.process($(this).serializeArray());
                });
            });
    },
    
    /**
     * Handles procesing of form data
     * @method nodedit.connect.process
     * @param {object} formData Data passed from connect.view form submission
     */
    process: function (formData) {
        var i = 0, 
            z = formData.length,
            session = {};
        for (i=0; i<=z-1; i++) {
            session[formData[i].name] = $.trim(formData[i].value);
        }
        // Run connection check
        nodedit.fsapi.check(session)
            .done(function (data) {
                if (data.status === "success") {
                    //If return good, save to session
                    nodedit.session(session);
                    // Initialize the workspace
                    nodedit.workspace.init();
                } else {
                    nodedit.message.error("Could not connect to server");
                }
            })
            .fail(function () {
                nodedit.message.error("Could not connect to server");
            });
    },
    
    /**
     * Closes the connect by clearing the session
     * @method modedit.connect.close
     */
    close: function () {
        nodedit.session("clear");
        window.location.reload();
    }
};