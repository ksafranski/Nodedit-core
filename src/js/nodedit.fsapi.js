/**
 * @object nodedit.fsapi
 * 
 * Handles all remote filesystem requests and responses
 */
nodedit.fsapi = {
    
    /**
     * @method nodedit.fsapi.check
     * 
     * Used by nodedit.connect to check if session is valid
     * @param {object} session The object containing remote url and key
     */
    check: function (session) {
        return $.get(session.url+'/'+session.key+'/dir/');    
    },
    
    /**
     * @method nodedit.fsapi.request
     * 
     * Makes request against remote server
     * @param {string} url The remote url with key
     * @param {string} type The type of request (GET, POST, PUT, DELETE)
     * @param {object} params Any data (POST/PUT) to be sent
     * @param {function} fn The callback after success or error
     */
    request: function (url, type, params, fn) {
        $.ajax({
            url: url,
            type: type,
            data: params,
            success: function (res) {
                if (res.status === "success") {
                    // Success response
                    if (!res.data) {
                        // No data, but successful
                        fn(true);
                    } else {
                        // Success with data
                        fn(res.data);
                    }
                } else {
                    // Fail response
                    fn(false);
                }
            },
            error: function () {
                fn(false);
            }
        });
    },
    
    /**
     * @method nodedit.fsapi.open
     * 
     * Opens and returns contents of file
     * @param {string} path The full path to the file
     * @param {function} fn The callback on success
     */
    open: function (path, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/file" + path;
        nodedit.fsapi.request(url, "GET", null, fn);
    },
    
    /**
     * @method nodedit.fsapi.list
     * 
     * Returns the contens of a directory
     * @param {string} path The full path to the file
     * @param {function} fn The callback on success
     */
    list: function (path, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/dir" + path;
        nodedit.fsapi.request(url, "GET", null, fn);
    },
    
    /**
     * Create (POST)
     */
    
    /**
     * @method nodedit.fsapi.create
     * 
     * Creates a file or directory
     * @param {string} path The full path to the file
     * @param {string} type Either 'file' or 'dir'
     * @param {function} fn The callback on success
     */
    create: function (path, type, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/" + type + path;
        nodedit.fsapi.request(url, "POST", null, fn);
    },
    
    /**
     * @method nodedit.fsapi.createFile
     * 
     * Proxy for create
     * @param {string} path The full path to the file
     * @param {function} fn The callback on success
     */
    createFile: function (path, fn) {
        this.create(path, "file", fn);
    },
    
    /**
     * @method nodedit.fsapi.createDirectory
     * 
     * Proxy for create
     * @param {string} path The full path to the file
     * @param {function} fn The callback on success
     */
    createDirectory: function (path, fn) {
        this.create(path, "dir", fn);
    },
    
    /**
     * @method nodedit.fsapi.copy
     * 
     * Copies a file or directory (and all contents)
     * @param {string} path The full path to the file
     * @param {string} detsination The full path of the copy destination
     * @param {function} fn The callback on success
     */
    copy: function (path, destination, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/copy" + path;
        nodedit.fsapi.request(url, "POST", { destination: destination }, fn);
    },
    
    /**
     * @method nodedit.fsapi.move
     * 
     * Similar to 'Cut+Paste', copies the file, then deletes original
     * @param {string} path The full path to the file
     * @param {string} destination The full path of the move-to destination
     * @param {function} fn The callback on success
     */
    move: function (path, destination, fn) {
        var _this = this;
        this.copy(path, destination, function (data) {
            if (data.status === "success") {
                _this.delete(path, fn);   
            } else {
                fn(data);
            }
        });
    },
    
    /**
     * @method nodedit.fsapi.save
     * 
     * Saves contents to a file
     * @param {string} path The full path to the file
     * @param {sting} data The data to be placed in the file
     * @param {function} fn The callback on success
     */
    save: function (path, data, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/save" + path;
        nodedit.fsapi.request(url, "PUT", { data: data }, fn);
    },
    
    /**
     * @method nodedit.fsapi.rename
     * 
     * Renames a file or directory
     * @param {string} path The full path to the file
     * @param {string} name The new name of the file or directory
     * @param {function} fn The callback on success
     */
    rename: function (path, name, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/rename" + path;
        nodedit.fsapi.request(url, "PUT", { name: name }, fn);
    },
    
    /**
     * @method nodedit.fsapi.delete
     * 
     * Deletes a file or directory
     * @param {string} path The full path to the file
     * @param {function} fn The callback on success
     */
    delete: function (path, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + path;
        nodedit.fsapi.request(url, "DELETE", { name: name }, fn);
    } 
    
};