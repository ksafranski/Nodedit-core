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
    getList: function () {
        // Open the bookmarks file stored in the root
        nodedit.fsapi.open('/nodedit.bookmarks.json', function (res) {
            // Parse and return results
            return JSON.parse(res); 
        });
    },
    
    /**
     * @method nodedit.bookmarks.saveList
     * 
     * Saves JSON-formatted list back to root of node
     */
    saveList: function (bookmarks) {
        // Ensure file exists
        nodedit.fsapi.createFile('/nodedit.bookmarks.json', function () {
            // Put contents in file
            nodedit.fsapi.save('/nodedit.bookmarks.json', JSON.stringify(bookmarks, null, 4), function () {
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