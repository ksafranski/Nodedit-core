/**
 * Handles all remote filesystem requests and responses
 * @namespace nodedit.fsapi
 */
nodedit.fsapi = {
    
    /**
     * Used by nodedit.connect to check if session is valid
     * @method nodedit.fsapi.check
     * @param {object} session The object containing remote url and key
     */
    check: function (session) {
        return $.get(session.url+'/'+session.key+'/dir/');    
    },
    
    /**
     * Makes request against remote server
     * @method nodedit.fsapi.request
     * @param {string} url The remote url with key
     * @param {string} type The type of request (GET, POST, PUT, DELETE)
     * @param {object} params Any data (POST/PUT) to be sent
     * @param {{requestCallback}} fn The callback after success or error
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
     * Opens and returns contents of file
     * @method nodedit.fsapi.open
     * @param {string} path The full path to the file
     * @param {requestCallback} fn The callback on success
     */
    open: function (path, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/file" + path;
        nodedit.fsapi.request(url, "GET", null, fn);
    },
    
    /**
     * Returns the contens of a directory
     * @method nodedit.fsapi.list
     * @param {string} path The full path to the file
     * @param {requestCallback} fn The callback on success
     */
    list: function (path, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/dir" + path;
        nodedit.fsapi.request(url, "GET", null, fn);
    },
    
    /**
     * Create (POST)
     */
    
    /**
     * Creates a file or directory
     * @method nodedit.fsapi.create
     * @param {string} path The full path to the file
     * @param {string} type Either 'file' or 'dir'
     * @param {requestCallback} fn The callback on success
     */
    create: function (path, type, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/" + type + path;
        nodedit.fsapi.request(url, "POST", null, fn);
    },
    
    /**
     * Proxy for create
     * @method nodedit.fsapi.createFile
     * @param {string} path The full path to the file
     * @param {requestCallback} fn The callback on success
     */
    createFile: function (path, fn) {
        this.create(path, "file", fn);
    },
    
    /**
     * Proxy for create
     * @method nodedit.fsapi.createDirectory
     * @param {string} path The full path to the file
     * @param {requestCallback} fn The callback on success
     */
    createDirectory: function (path, fn) {
        this.create(path, "dir", fn);
    },
    
    /**
     * Copies a file or directory (and all contents)
     * @method nodedit.fsapi.copy
     * @param {string} path The full path to the file
     * @param {string} detsination The full path of the copy destination
     * @param {requestCallback} fn The callback on success
     */
    copy: function (path, destination, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/copy" + path;
        nodedit.fsapi.request(url, "POST", { destination: destination }, fn);
    },
    
    /**
     * Similar to 'Cut+Paste', copies the file, then deletes original
     * @method nodedit.fsapi.move
     * @param {string} path The full path to the file
     * @param {string} destination The full path of the move-to destination
     * @param {requestCallback} fn The callback on success
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
     * Saves contents to a file
     * @method nodedit.fsapi.save
     * @param {string} path The full path to the file
     * @param {sting} data The data to be placed in the file
     * @param {requestCallback} fn The callback on success
     */
    save: function (path, data, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/save" + path;
        nodedit.fsapi.request(url, "PUT", { data: data }, fn);
    },
    
    /**
     * Renames a file or directory
     * @method nodedit.fsapi.rename
     * @param {string} path The full path to the file
     * @param {string} name The new name of the file or directory
     * @param {requestCallback} fn The callback on success
     */
    rename: function (path, name, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/rename" + path;
        nodedit.fsapi.request(url, "PUT", { name: name }, fn);
    },
    
    /**
     * Deletes a file or directory
     * @method nodedit.fsapi.delete
     * @param {string} path The full path to the file
     * @param {requestCallback} fn The callback on success
     */
    delete: function (path, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + path;
        nodedit.fsapi.request(url, "DELETE", { name: name }, fn);
    } 
    
};