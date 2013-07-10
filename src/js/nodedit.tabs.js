/**
 * @object nodedit.tabs
 * 
 * Controls for the editor tabs
 */
nodedit.tabs = {
    
    el: '#tabs',
    
    overflow_timeout: null,
    
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
            _this.sortable();
            _this.overflow();
        });
    },
    
    /**
     * @method nodedit.tabs.sortable
     * 
     * Initializes tab sortable functionality
     */
    sortable: function () {
        var _this = this;
        nodedit.$el.find(_this.el).sortable({ 
            axis: 'x', 
            items: 'li',
            containment: 'parent',
            placeholder: 'tab-sort-placeholder',
            distance: 5
        });  
    },
    
    /**
     * @method nodedit.tabs.overflow
     * 
     * Handles overflow of tabs expanding past horizontal space available
     */
    overflow: function () {
        var _this = this,
            tab_els = nodedit.$el.find(_this.el).children('li'),
            w_available = nodedit.$el.find(_this.el).outerWidth(),
            tab_w, tab_count, cur_tab, new_tab, remainder;
        
        // Get tab width
        tab_w = tab_els.outerWidth();
        // Get tab count
        tab_count = tab_els.length;
        
        // Out of space?
        if ((tab_w*tab_count) > w_available-30) {
            // Clear any existing contents
            nodedit.$el.find('#tabs-reveal-menu').remove();
            // Find remainder
            remainder = Math.ceil(((tab_w*tab_count)-(w_available-30))/tab_w);
            // Create reveal icon
            nodedit.$el.find(_this.el).append('<a id="tabs-reveal" class="icon-double-angle-right"></a>');
            // Create reveal menu
            nodedit.$el.append('<ul id="tabs-reveal-menu"></ul>');
            
            // Loop in remainder tabs
            for (var i=tab_count-remainder, z=tab_count; i<z; i++){
                // Get current tab
                cur_tab = nodedit.$el.find(_this.el).children('li:eq('+i+')');
                
                // Add element to menu
                nodedit.$el.find('#tabs-reveal-menu').append('<li data-id="'+cur_tab.data('id')+'">'+cur_tab.html()+'</li>');
                
                // Get new tab
                new_tab = nodedit.$el.find('#tabs-reveal-menu').children('li[data-id="'+cur_tab.data('id')+'"]');
                
                // Bind click on tab
                new_tab.on('click', function () {
                    nodedit.editor.gotoInstance($(this).data('id'));
                });
                
                // Bind click on close
                new_tab.on('click','a', function () {
                   nodedit.editor.close($(this).parent('li').data('id')); 
                });
                
            }
            
            // Bind click to show menu
            nodedit.$el.find(_this.el).children('#tabs-reveal').on('click', function () { 
                nodedit.$el.find('#tabs-reveal-menu').show();    
            });
            
            // Hide menu on mouseleave
            nodedit.$el.find('#tabs-reveal-menu').on('mouseleave', function() {
                $(this).hide();
            });
            
            // Set active pointer
            _this.setActive(_this.getActive());
            
        } else {
            nodedit.$el.find(_this.el).children('#tabs-reveal').remove();
            nodedit.$el.find('#tabs-reveal-menu').remove();
        }
        
        // Bind to resize, use timeouts to prevent rapid-fire during resize
        $(window).resize(function () {
            window.clearTimeout(_this.overflow_timeout);
            _this.overflow_timeout = setTimeout(function () {
                _this.overflow();
            }, 250);
            
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
        nodedit.$el.find(_this.el).children('li').filterByData('id', id).remove();
        _this.sortable();
        _this.overflow();
    },
    
    /**
     * @method nodedit.tabs.rename
     * 
     * Handles rename of any open files and path changes
     * @param {string} oldPath The existing path
     * @param {string} newPath The new path
     * @param {int} id The id of the instance
     */
    rename: function (oldPath, newPath, id) {
        var _this = this,
            tab = nodedit.$el.find(_this.el).children('li').filterByData('id', id),
            curPath = tab.attr('title');
        
        // Change title attr
        tab.attr('title', tab.attr('title').replace(oldPath, newPath));
        
        if (curPath===oldPath) {
            // Full path match, change label
            tab.children('label').text(nodedit.filemanager.getFileName(newPath));
        }
        
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
        nodedit.$el.find('#tabs-reveal-menu').children('li').removeClass('active');
        nodedit.$el.find(_this.el).children('li').filterByData('id', id).addClass('active');
        nodedit.$el.find('#tabs-reveal-menu').children('li').filterByData('id', id).addClass('active');
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
        nodedit.$el.find(_this.el).find('li').filterByData('id', id).on('click', 'a', function () {
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
        nodedit.$el.find(_this.el).find('li').filterByData('id', id).on('click', function () {
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
            label = nodedit.$el.find(_this.el).children('li').filterByData('id', id).children('label');
        
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
        nodedit.$el.find(_this.el).children('li').filterByData('id', id).children('label').removeClass('changed');
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
            if (nodedit.$el.find(_this.el).children('li').filterByData('id', id).children('label').hasClass('changed')) {
                return true;
            }
        } else {
            for (i in nodedit.editor.instances) {
                if (nodedit.$el.find(_this.el).children('li').filterByData('id', id).children('label').hasClass('changed')) {
                    return true;
                }
            }
        }
        
        // No returns, return false
        return false;
        
    }
    
};