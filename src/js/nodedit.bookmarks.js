/**
 * @object nodedit.bookmarks
 * 
 * Controls for bookmarks
 */
nodedit.bookmarks = {
    
    /**
     * @method nodedit.bookmarks.getList
     * 
     * Retrieves list of bookmarks from root of node
     */
    getList: function (fn) {
        // Open the bookmarks file stored in the root
        nodedit.fsapi.open('/.nodedit.bookmarks.json', function (res) {
            // Parse and return results in callback
            fn(JSON.parse(res)); 
        });
    },
    
    /**
     * @method nodedit.bookmarks.openDialog
     * 
     * Opens the bookmark dialog
     * @param {object} add Optional object containing 'name' and 'path' of a new bookmark
     */
    openDialog: function (add) {
        var _this = this,
            tmpl_data = {},
            item,
            i = 0,
            save_data_raw,
            save_data_formatted = {},
            cur_node;
        
        // Get list of current bookmarks
        _this.getList(function (list) {
            
            // If adding, create new node for template
            if (add) {
                tmpl_data[i] = { name: add.name, path: add.path, create: true };
                i++;
            }
            
            // Modify list object for template
            for (item in list) {
                tmpl_data[i] = { name: item, path: list[item], create: false };
                i++;
            }
            
            // Open modal and load template
            nodedit.modal.open(500, 'Bookmarks', 'bookmarks.tpl', tmpl_data, function () {
                // Bind to delete icons
                nodedit.$el.find(nodedit.modal.el).on('click', '.icon-trash', function (e) {
                    $(this).parent('td').parent('tr').remove();
                    console.log('remove');
                });
                
                // Handle form submission
                nodedit.$el.find(nodedit.modal.el).on('submit', 'form', function (e) {
                e.preventDefault();
                    // Serialize form data to array
                    save_data_raw = $(this).serializeArray();
                    // Format data
                    for (i=0, z=save_data_raw.length; i<z; i++) {
                        if(save_data_raw[i].name==='name'){
                            cur_node = save_data_raw[i].value;
                        } else {
                            save_data_formatted[cur_node] = save_data_raw[i].value;
                        }
                    }
                    // Save data to file
                    _this.saveList(save_data_formatted);
                });
                
            });
        });
        
    },
    
    
    /**
     * @method nodedit.bookmarks.addBookmark
     * 
     * Checks if bookmark already exists before sending through to openDialog
     * @param {object} add Optional object containing 'name' and 'path' of a new bookmark
     */
    addBookmark: function (add) {
        var _this = this;
        _this.getList(function (list) {
            for (var i in list) {
                if(list[i]===add.path) {
                    // Bookmark already exists
                    nodedit.message.error('Already bookmarked as '+i);
                    return false;
                }
            }
            // No duplicates, open dialog
            _this.openDialog(add);  
        });
    },
    
    /**
     * @method nodedit.bookmarks.saveList
     * 
     * Saves JSON-formatted list back to root of node
     */
    saveList: function (bookmarks) {
        // Ensure file exists
        nodedit.fsapi.createFile('/.nodedit.bookmarks.json', function () {
            // Put contents in file
            nodedit.fsapi.save('/.nodedit.bookmarks.json', JSON.stringify(bookmarks, null, 4), function () {
                nodedit.message.success('Bookmarks successfully saved');    
            });
        });
    },
    
    /**
     * @method nodedit.bookmarks.setCurrent
     * 
     * Sets the current bookmark in localStorage
     * @param {string} name The name of the bookmark
     * @param {string} path The path (from root)
     */
    setCurrent: function (name, path) {
        nodedit.store('nodedit_bookmark', { name: name, path: path });
    },
    
    /**
     * @method nodedit.bookmarks.getCurrent
     * 
     * Returns object containing current bookmark 'name' and 'path'
     */
    getCurrent: function () {
        return JSON.parse(nodedit.store('nodedit_bookmark'));
    }
    
};