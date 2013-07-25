/**
 * Controls for modal window actions
 * @namespace nodedit.modal
 */
nodedit.modal = {
    
    el: "#modal",
    
    overlay: "#modal-overlay",

    /**
     * Opens an instance of the modal
     * @method nodedit.modal.open
     * @param {number} width The width of the modal
     * @param {string} title The title to display
     * @param {string} template The template to load
     * @param {string|object} [data] Any data to be loaded into the template
     * @param {requestCallback} [fn] Callback function
     */
    open: function (width, title, template, data, fn) {
        // Close any open modals
        this.close();
        
        data = data || {};
        fn = fn || null;
        
        // Declare variables
        var _this = this;
        
        // Build DOM container
        nodedit.$el.append("<div id=\""+_this.overlay.replace("#","")+"\"></div><div id=\""+_this.el.replace("#","")+"\"></div>");
        
        // Create DOM element
        nodedit.$el.find(_this.el).css({ "width": width+"px", "margin-left":"-"+Math.round(width/2)+"px" });
        
        // Load content template
        nodedit.template(template, data, function (content) {
            // Load modal template
            nodedit.template("modal.tpl", { title: title }, function (tmpl) {
                // Show content
                nodedit.$el.find(_this.el).html(tmpl).children("#modal-content")
                    .html(content)
                    .find("input:not([type=hidden]):first")
                    .focus();
                // Fire callback
                if (fn) {
                    fn();
                }
            });
        });
        
        // Bind close
        nodedit.$el.find(_this.el).on("click", "a.icon-remove", function () {
            _this.close();
        });
    },
    
    /**
     * Closes the modal window
     * @method nodedit.modal.close
     */
    close: function () {
        var _this = this;
        // Remove DOM element
        nodedit.$el.find(_this.el+","+_this.overlay).remove();
    }

};