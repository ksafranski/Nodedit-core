/**
 * @method nodedit.modal
 * 
 * Controls for modal window actions
 */
nodedit.modal = {
    
    el: '#modal',

    /**
     * @method nodedit.modal.open
     * 
     * Opens an instance of the modal
     * @param {int} width The width of the modal
     * @param {string} title The title to display
     * @param {string} template The template to load
     * @param {string|object} data optional Any data to be loaded into the template
     * @param {function} fn optional Callback function
     */
    open: function (width, title, template, data, fn) {
        // Close any open modals
        this.close();
        
        // Declare variables
        var _this = this,
            modal = nodedit.$el.append('<div id="'+_this.el.replace('#','')+'"></div>');
        
        // Create DOM element
        nodedit.$el.find(_this.el).css({ 'width': width+'px', 'margin-left':'-'+Math.round(width/2)+'px' });
        
        // Load content template
        nodedit.template(template, data, function (content) {
            // Load modal template
            nodedit.template('modal.tpl', { title: title }, function (tmpl) {
                // Show content
                nodedit.$el.find(_this.el).html(tmpl).children('#modal-content').html(content);
                // Fire callback
                if (fn) {
                    fn();
                }
            });
        });
        
        
        
        // Bind close
        nodedit.$el.find(_this.el).on('click', 'a.icon-remove', function () {
            _this.close();
        });
    },
    
    /**
     * @method nodedit.modal.close
     */
    close: function () {
        var _this = this;
        // Remove DOM element
        nodedit.$el.find(_this.el).remove();
    }

};