nodedit.fsapi = {
    
    /**
     * Request
     * 
     * Makes request
     */
     
    request: function (url, type, params, fn) {
        var _this = this;
        this.ajax({
            url: url,
            type: type,
            data: params,
            success: function (res) {
                res = JSON.parse(res);
                (_this.config().fsapiValidate) ? fn(_this.validate(res)) : fn(res);
            },
            error: function () {
                fn("{ \"status\": \"failure\" }");
            }
        });
    },
    
    /**
     * Validate Response
     */
     
    validate: function (res) {
        if (res.status === "success") {
            if (!res.data) {
                // No data, but successful
                return true;
            } else {
                // Success with data
                return res.data;
            }
        } else {
            return false;
        }
    },
    
    /**
     * Read (GET)
     */
    
    open: function (path, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/file/" + path;
        nodedit.fsapi.request(url, "GET", null, fn);
    },
    
    list: function (path, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/dir/" + path;
        nodedit.fsapi.request(url, "GET", null, fn);
    },
    
    /**
     * Create (POST)
     */
    
    // Create handler
    create: function (path, type, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/" + type + "/" + path;
        nodedit.fsapi.request(url, "POST", null, fn);
    },
    
    // Proxy for create (file)
    createFile: function (path, fn) {
        this.create(path, "file", fn);
    },
    
    // Proxy for create (dir)
    createDirectory: function (path, fn) {
        this.create(path, "dir", fn);
    },
    
    // Copy file or directory
    copy: function (path, destination, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/copy/" + path;
        nodedit.fsapi.request(url, "POST", { destination: destination }, fn);
    },
    
    // Performs copy, then delete original
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
     * Update (PUT)
     */
    
    save: function (path, data, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/save/" + path;
        nodedit.fsapi.request(url, "PUT", { data: data }, fn);
    },
    
    rename: function (path, name, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/rename/" + path;
        nodedit.fsapi.request(url, "PUT", { name: name }, fn);
    },
    
    /**
     * Delete (DELETE)
     */
    
    delete: function (path, fn) {
        var url = nodedit.session().url + "/" + nodedit.session().key + "/"+ path;
        nodedit.fsapi.request(url, "DELETE", { name: name }, fn);
    },
    
    /**
     * AJAX Handler
     * 
     * **Configuration Object:**
     * 
     * `url`: URL of request if not specified as first argument
     * 
     * `type`: Request method, defaults to `GET`
     * 
     * `async`: Run request asynchronously, defaults to `TRUE`
     * 
     * `cache`: Cache the request, defaults to `TRUE`
     * 
     * `data`: Object or JSON data passed through request
     * 
     * `success`: Function called on successful request
     * 
     * `error`: Function called on failure of request
     * 
     * `qsData`: Allows blocking (set `false`) of `data` add to URL for RESTful requests
    */
    
    ajax: function() {

        // Parent object for all parameters
        var xhr = {};
    
        // Determine call structure: ajax(url, { params }); or ajax({ params });
        if (arguments.length === 1) {
            // All params passed as object
            xhr = arguments[0];
        } else {
            // Populate xhr obj with second argument
            xhr = arguments[1];
            // Add first argument to xhr object as url
            xhr.url = arguments[0];
        }        
    
        // Parameters & Defaults
        xhr.request = false;
        xhr.type = xhr.type || "GET";
        xhr.data = xhr.data || null;
        if (xhr.qsData || !xhr.hasOwnProperty("qsData")) { xhr.qsData = true; } else { xhr.qsData = false; }
        if (xhr.cache || !xhr.hasOwnProperty("cache")) { xhr.cache = true; } else { xhr.cache = false; }
        if (xhr.async || !xhr.hasOwnProperty("async")) { xhr.async = true; } else { xhr.async = false; }
        if (xhr.success && typeof xhr.success === "function") { xhr.success = xhr.success; } else { xhr.success = false; }
        if (xhr.error && typeof xhr.error === "function") { xhr.error = xhr.error; } else { xhr.error = false; }
        
        // Format xhr.data & encode values
        if (xhr.data) {
            var param_count = 0,
                name,
                value,
                tmp_data = xhr.data;
            for (var param in tmp_data) {
                if(tmp_data.hasOwnProperty(param)){
                    name = encodeURIComponent(param);
                    value = encodeURIComponent(tmp_data[param]);
                    if (param_count === 0) {
                        xhr.data = name + "=" + value;
                    } else {
                        xhr.data += "&" + name + "=" + value;
                    }
                    param_count++;
                }
            }
            xhr.data = xhr.data;
        }
    
        // Appends data to URL
        function formatURL(data) {
            var url_split = xhr.url.split("?");
            if (url_split.length !== 1) {
                xhr.url += "&" + data;
            } else {
                xhr.url += "?" + data;
            }
        }
    
        // Handle xhr.data on GET request type
        if (xhr.data && xhr.type.toUpperCase() === "GET" && xhr.qsData) {
            formatURL(xhr.data);
        }
    
        // Check cache parameter, set URL param
        if (!xhr.cache) {
            formatURL(new Date().getTime());
        }
    
        // Establish request
        if (window.XMLHttpRequest) {
            // Modern non-IE
            xhr.request = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // Internet Explorer
            xhr.request = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            // No request object, break
            return false;
        }
    
        // Monitor ReadyState
        xhr.request.onreadystatechange = function () {
            if (xhr.request.readyState === 4) {
                if (xhr.request.status === 200) {
                    if (xhr.success) {
                        // Returns responseText and request object
                        xhr.success(xhr.request.responseText, xhr.request);
                    }
                } else {
                    if (xhr.error) {
                        // Returns request object
                        xhr.error(xhr.request);
                    }
                }
            }
        };
    
        // Open Http Request connection
        xhr.request.open(xhr.type, xhr.url, xhr.async);
    
        // Set request header for POST
        if (xhr.type.toUpperCase() === "POST" || xhr.type.toUpperCase() === "PUT") {
            xhr.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
    
        // Send data
        xhr.request.send(xhr.data);
    
    }  
    
};