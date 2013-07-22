/**
 * Controls for the editor tabs
 * @namespace nodedit.tabs
 */
nodedit.tabs = {
    
    el: '#tabs',
    
    overflow_timeout: null,
    
    /**
     * Opens a new tab
     * @method nodedit.tabs.open
     * @param {number} id The id of the editor/tab instance
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
     * Initializes tab sortable functionality
     * @method nodedit.tabs.sortable
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
     * Handles overflow of tabs expanding past horizontal space available
     * @method nodedit.tabs.overflow
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
     * Closes a tab
     * @method nodedit.tabs.close
     * @param {number} id The id of the editor/tab instance
     */
    close: function (id) {
        var _this = this,
            tab = nodedit.$el.find(_this.el).children('li').filterByData('id', id),
            index = tab.index(),
            maxIndex = (nodedit.$el.find(_this.el).children('li').size())-1,
            openIndexOf;
            
        tab.remove();
        // Find and switch to neighboring tab (if this is the active tab)
        if (tab.hasClass('active')) {
            if (index>0) {
                // Prefer move to left, check that this isn't first tab
                openIndexOf = index-1;
            } else if (index<maxIndex) {
                // If not the last item, open the item to right (will match the closed item's index)
                openIndexOf = index;
            }
            
            if (openIndexOf!==undefined) {
                var newId = nodedit.$el.find(_this.el).children('li:eq('+openIndexOf+')').attr('data-id');
                nodedit.editor.gotoInstance(newId);
            }
        }
        
        //Rebind sortable and overflow handlers
        _this.sortable();
        _this.overflow();
    },
    
    /**
     * Handles rename of any open files and path changes
     * @method nodedit.tabs.rename
     * @param {string} oldPath The existing path
     * @param {string} newPath The new path
     * @param {number} id The id of the instance
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
     * Sets active tab
     * @method nodedit.tabs.setActive
     * @param {number} id The id of the editor/tab instance
     */
    setActive: function (id) {
        var _this = this;
        nodedit.$el.find(_this.el).children('li').removeClass('active');
        nodedit.$el.find('#tabs-reveal-menu').children('li').removeClass('active');
        nodedit.$el.find(_this.el).children('li').filterByData('id', id).addClass('active');
        nodedit.$el.find('#tabs-reveal-menu').children('li').filterByData('id', id).addClass('active');
    },
    
    /**
     * Return the active tab or false
     * @method nodedit.tabs.getActive
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
     * Binds click to close button
     * @method nodedit.tabs.bindClose
     * @param {number} id The id of the editor/tab instance
     */
    bindClose: function (id) {
        var _this = this;
        nodedit.$el.find(_this.el).find('li').filterByData('id', id).on('click', 'a', function (e) {
            e.stopPropagation(); // Stop propagation to tab (li) item
            nodedit.editor.close(id);
        });
    },
    
    /**
     * Binds click to the tab
     * @method nodedit.tabs.bindClick
     * @param {number} id The id of the editor/tab instance
     */
    bindClick: function (id) {
        var _this = this;
        nodedit.$el.find(_this.el).find('li').filterByData('id', id).on('click', function () {
            nodedit.editor.gotoInstance(id);
        });
    },
    
    /**
     * Marks the tab to show editor has unsaved changes
     * @method nodedit.tabs.markChanged
     * @param {number} id The id of the editor/tab instance
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
     * Marks the tab to show editor has NO unsaved changes
     * @method nodedit.tabs.markUnchanged
     * @param {number} id The id of the editor/tab instance
     */
    markUnchanged: function (id) {
        var _this = this;
        nodedit.$el.find(_this.el).children('li').filterByData('id', id).children('label').removeClass('changed');
    },
    
    /**
     * Checks if tab reports unsaved changes
     * @method nodedit.tabs.checkChanged
     * @param {number} [id] Either specifies id of editor/tab or checks all (if not specified)
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