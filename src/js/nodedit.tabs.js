/**
 * @object nodedit.tabs
 * 
 * Controls for the editor tabs
 */
nodedit.tabs = {
    
    el: '#tabs',
    
    /**
     * @method nodedit.tabs.open
     * 
     * Opens a new tab
     * @param {int} id The id of the editor/tab instance
     */
    open: function (id) {
        var _this = this,
            path = nodedit.editor.getPath(id),
            name = nodedit.filemanager.getFileName(path);
        // Compile template
        nodedit.template('tab.tpl', {id: id, path: path, name: name}, function(tmpl) {
            // Add tab
            nodedit.$el.find(_this.el).append(tmpl); 
            _this.setActive(id);
            _this.bindClose(id);
            _this.bindClick(id);
        });
    },
    
    /**
     * @method nodedit.tabs.close
     * 
     * Closes a tab
     * @param {int} id The id of the editor/tab instance
     */
    close: function (id) {
        var _this = this;
        nodedit.$el.find(_this.el).children('[data-id="'+id+'"]').remove();
    },
    
    /**
     * @method nodedit.tabs.setActive
     * 
     * Sets active tab
     * @param {int} id The id of the editor/tab instance
     */
    setActive: function (id) {
        var _this = this;
        nodedit.$el.find(_this.el).children('li').removeClass('active');
        nodedit.$el.find(_this.el).children('[data-id="'+id+'"]').addClass('active');
    },
    
    /**
     * @method nodedit.tabs.getActive
     * 
     * Return the active tab or false
     */
    getActive: function () {
        var _this = this;
        if (nodedit.$el.find(_this.el).children('li.active').length!==0) {
            return nodedit.$el.find(_this.el).children('li.active').data('id');
        } else {
            return false;
        }
    },
    
    /**
     * @method nodedit.tabs.bindClose
     * 
     * Binds click to close button
     * @param {int} id The id of the editor/tab instance
     */
    bindClose: function (id) {
        var _this = this;
        nodedit.$el.find(_this.el).children('[data-id="'+id+'"]').on('click', 'a', function () {
            nodedit.editor.close(id);
        });
    },
    
    /**
     * @method nodedit.tabs.bindClick
     * 
     * Binds click to the tab
     * @param {int} id The id of the editor/tab instance
     */
    bindClick: function (id) {
        var _this = this;
        nodedit.$el.find(_this.el).children('[data-id="'+id+'"]').on('click', function () {
            nodedit.editor.gotoInstance(id);
        });
    },
    
    /**
     * @method nodedit.tabs.markChanged
     * 
     * Marks the tab to show editor has unsaved changes
     * @param {int} id The id of the editor/tab instance
     */
    markChanged: function (id) {
        var _this = this,
            label = nodedit.$el.find(_this.el).children('li[data-id="'+id+'"]').children('label');
        
        // Compare to initial state
        if (nodedit.editor.getContent(id)!=nodedit.editor.instances[id].content) {
            label.addClass('changed');
        } else {
            _this.markUnchanged(id);
        }
    },
    
    /**
     * @method nodedit.tabs.markUnchanged
     * 
     * Marks the tab to show editor has NO unsaved changes
     * @param {int} id The id of the editor/tab instance
     */
    markUnchanged: function (id) {
        var _this = this;
        nodedit.$el.find(_this.el).children('li[data-id="'+id+'"]').children('label').removeClass('changed');
    },
    
    /**
     * @method nodedit.tabs.checkChanged
     * 
     * Checks if tab reports unsaved changes
     * @param {int} id Optional - either specifies id of editor/tab or checks all
     */
    checkChanged: function (id) {
        var _this = this,
            i;
        if (id) {
            // Check for specific editor with unsaved changes
            if (nodedit.$el.find(_this.el).children('li[data-id="'+id+'"]').children('label').hasClass('changed')) {
                return true;
            }
        } else {
            for (i in nodedit.editor.instances) {
                if (nodedit.$el.find(_this.el).children('li[data-id="'+i+'"]').children('label').hasClass('changed')) {
                    return true;
                }
            }
        }
        
        // No returns, return false
        return false;
        
    }
    
};