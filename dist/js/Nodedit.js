/*!
 Nodedit is free software released without warranty under the MIT license by Kent Safranski
 Build version 0.1.0, 07-06-2013
*/
/**
 * @object nodedit
 * 
 * Creates the application object and initial configuration
 */
var nodedit = {

    templates: 'dist/templates/',
    
    el: '#nodedit'

};

// Starts app on page load
$(function(){ 

    // Cache the main container
    nodedit.$el = $(nodedit.el);
    
    // Check sessions
    if (nodedit.session()) {
        // Session exists, start workspace
        nodedit.workspace.init();
    } else {
        // No session, show connect view
        nodedit.connect.view();
    }

});

// Filter by data
$.fn.filterByData = function(prop, val) {
    return this.filter(
        function() { return $(this).data(prop)==val; }
    );
};/**
 * @method nodedit.keybind
 * 
 * Instantiated to create keybindings
 * 
 * var konami = new nodedit.keybind({
 *      code: 'up up down down left right left right b a',
 *      timeout: 5000,
 *      callback: function(){
 *           alert('KONAMI!');
 *      }
 *   });
 */
nodedit.keybind = function(params){
    
    /**
     * Assign combo code
     */
 
    this.code = params.code || null;
    
    /**
     * Timeout before cur_combo resets
     */
 
    this.timeout = params.timeout || 1000;
    
    /**
     * Callback
     */
 
    this.callback = params.callback || false;
    
    /**
     * Holds currently entered combo
     */
 
    this.cur_combo = '';
    
    /**
     * Starts the key listener, timer and check
     */
 
    this.init = function(){
        
        var _this = this;
        
        document.onkeydown = function(evt) {
            evt = evt || window.event;
            var name = _this.keycodes[evt.keyCode];
            if(_this.cur_combo.length>0){
                _this.cur_combo += ' ';
            }
            _this.cur_combo += name;
            _this.runTimer();
            _this.checkCode(evt);
        };
        
    };
    
    /**
     * Controls duration of time available to complete code
     */
    
    this.runTimer = function(){
        var _this = this;
        
        // Clear timeout
        if(this.combotimer){ 
            clearTimeout(this.combotimer);   
        }
        
        this.combotimer = setTimeout(function(){
            _this.cur_combo = '';
        }, this.timeout);
    };
    
    /**
     * Checks for code match and fires callback
     */
    
    this.checkCode = function(e){
        if (this.cur_combo.indexOf(this.code)!== -1 && this.callback){
            e.preventDefault();
            this.cur_combo = '';
            this.callback();
        }
    };
    
    /**
     * Library of keycodes
     */
    
    this.keycodes = {
        8: "backspace",
        9: "tab",
        13: "enter",
        14: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        19: "pause",
        20: "caps",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        44: "printscreen",
        45: "insert",
        46: "delete",
        48: "0",
        96: "0", //numpad
        49: "1",
        97: "1", //numpad
        50: "2",
        98: "2", //numpad
        51: "3",
        99: "3", //numpad
        52: "4",
        100: "4", //numpad
        53: "5",
        101: "5", //numpad
        54: "6",
        102: "6", //numpad
        55: "7",
        103: "7", //numpad
        56: "8",
        104: "8", //numpad
        57: "9",
        105: "9", //numpad
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        144: "numlock",
        145: "scrolllock",
        186: "semicolon",
        187: "equals",
        189: "minus",
        188: "comma",
        190: "period",
        191: "forwardslash",
        219: "openbracket",
        220: "backslash",
        221: "closebracket",
        222: "quote"
    };
    
    /**
     * Start up on instantiation
     */
    
    this.init();   
    
};/**
 * @object nodedit.message
 * 
 * Hanldes notifications and messaging
 */
nodedit.message = {
    
    /**
     * @method nodedit.message.show
     * 
     * Visibly displays the message
     * @param {string} msg The message
     * @param {string} type Error or success
     * 
     */
    show: function (msg, type) {
        
        var icon,
            block,
            blockHeight;
        
        // Remove any existing messages
        $('#message').remove();
        
        (type==='success') ? icon = 'icon-thumbs-up' : icon = 'icon-thumbs-down'; 
        
        // Create new instance
        $('body').append('<div id="message" class="'+type+'"><span class="'+icon+'"></span>&nbsp;'+msg+'</div>');
        block = $('#message');
        blockHeight = block.outerHeight();
        
        // Slide up and fade in
        block
            // Set start
            .css({'bottom':'-'+blockHeight+'px', 'opacity': '0'})
            .animate({'bottom':'0', 'opacity': '1'}, 500)
            
            // Wait 3 seconds
            .delay(3000)
            
            // Slide down and fade out
            .animate({'bottom':'-'+blockHeight+'px', 'opacity': '0'}, { 'complete': function () {
                $(this).remove();
            }}, 500)
        
    },
    
    /**
     * @method nodedit.message.error
     * 
     * Shows error message
     * @param {string} msg Message to display
     */
    error: function (msg) {
        nodedit.message.show(msg, 'error');
    },
    
    /**
     * @method nodedit.message.success
     * 
     * Shows success message
     * @param {string} msg Message to display
     */
    success: function (msg) {
        nodedit.message.show(msg, 'success');
    }
}/**
 * @method nodedit.template
 * 
 * Load the template
 * @param {string} tpl The template file to be loaded
 * @param {object} data (optional) Data to be loaded via Handlebars
 * @param {function} fn (optional) If passing in data, callback will return compiled template
 */
nodedit.template = function (tpl, data, fn) {
    
    return $.ajax({
        url: nodedit.templates+tpl,
        type: 'GET',
        success: function(tmpl){ 
            // Insert data
            if (data) {
                var template = Handlebars.compile(tmpl);
                tmpl = template({'data': data});
                fn(tmpl);
            }
        },
        error: function() {
            nodedit.message.error('Could not load template');
        }
    });

};

// Handlebars helper for object key-value
Handlebars.registerHelper('eachkeys', function (context, options) {
    var fn = options.fn, inverse = options.inverse,
        ret = "",
        empty = true;
    
    for (key in context) { empty = false; break; }
    
    if (!empty) {
        for (key in context) {
            ret = ret + fn({ 'key': key, 'value': context[key]});
        }
    } else {
        ret = inverse(this);
    }
    return ret;
});/**
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
    
};/**
 * @method nodedit.session()
 * 
 * Sets or gets session information
 * @param {session} Object - With format { url: 'ENDPOINT', key: 'API_KEY' } sets the session, 'clear' removes it, no value returns current session (or bool false)
 */
nodedit.session = function () {
    
    // Set or get
    if (arguments.length) {
        if (typeof arguments[0] === 'object') {
            // Session object passed in; store
            nodedit.store('nodedit_session', arguments[0]); 
        } else if (arguments[0] === 'clear') {
            // Clear session
            nodedit.store('nodedit_session', null);
        }
    } else {
        // No object passed
        if (nodedit.store('nodedit_session')) {
            // Session set, return data
            var session = JSON.parse(nodedit.store('nodedit_session'));
            return {
                url: session.url,
                key: session.key
            };
        } else {
            // No session, return false
            return false;
        }
    }
    
};/**
 * @method nodedit.store()
 * 
 * Stores and retrieves data from localstorage
 * @param {key} The key used to identify the storage obejct
 * @param {value} Optional - The value to set, null to remove object, or not specified to get
 */
nodedit.store = function (key, value) {

    // If value is detected, set new or modify store
    if (typeof value !== "undefined" && value !== null) {
        // Stringify objects
        if(typeof value === "object") {
            value = JSON.stringify(value);
        }
        // Add to / modify storage
        localStorage.setItem(key, value);
    }

    // No value supplied, return value
    if (typeof value === "undefined") {
        return localStorage.getItem(key);
    }

    // Null specified, remove store
    if (value === null) {
        localStorage.removeItem(key);
    }

};/**
 * @object nodedit.connect
 * 
 * Handles loading of the connection view and processing of form submission
 */
nodedit.connect = {
    
    /**
     * @method nodedit.connect.view
     * 
     * Loads the connect template and handles form submission
     */
    view: function() {
        
        nodedit.template('connect.tpl')
            .done(function (tmpl) {
                // Load DOM
                nodedit.$el.html(tmpl);
                // Bind submission
                $('form#connect').on('submit', function (e) {
                    e.preventDefault();
                    nodedit.connect.process($(this).serializeArray());
                });
            });
    },
    
    /**
     * @method nodedit.connect.process
     * 
     * Handles procesing of form data
     * @param {object} formData Data passed from connect.view form submission
     */
    process: function (formData) {
        var i = 0, 
            z = formData.length,
            session = {};
        for (i=0; i<=z-1; i++) {
            session[formData[i].name] = $.trim(formData[i].value);
        }
        // Run connection check
        nodedit.fsapi.check(session)
            .done(function (data) {
                if (data.status === 'success') {
                    //If return good, save to session
                    nodedit.session(session);
                    // Initialize the workspace
                    nodedit.workspace.init();
                } else {
                    nodedit.message.error('Could not connect to server');
                }
            })
            .fail(function () {
               nodedit.message.error('Could not connect to server');
            });
    },
    
    /**
     * @method modedit.connect.close
     * 
     * Closes the connect by clearing the session
     */
    close: function () {
        nodedit.session('clear');
        window.location.reload();
    }
};/**
 * @method nodedit.modal
 * 
 * Controls for modal window actions
 */
nodedit.modal = {
    
    el: '#modal',
    
    overlay: '#modal-overlay',

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
            modal = nodedit.$el.append('<div id="'+_this.overlay.replace('#','')+'"></div><div id="'+_this.el.replace('#','')+'"></div>');
        
        // Create DOM element
        nodedit.$el.find(_this.el).css({ 'width': width+'px', 'margin-left':'-'+Math.round(width/2)+'px' });
        
        // Load content template
        nodedit.template(template, data, function (content) {
            // Load modal template
            nodedit.template('modal.tpl', { title: title }, function (tmpl) {
                // Show content
                nodedit.$el.find(_this.el).html(tmpl).children('#modal-content')
                    .html(content)
                    .find('input:first-of-type')
                    .focus();
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
        nodedit.$el.find(_this.el+','+_this.overlay).remove();
    }

};/**
 * @object nodedit.workspace
 * 
 * Used to manage the nodedit workspace (filemanager and editor) loading
 */
nodedit.workspace = {
    
    /**
     * @method nodedit.workspace.init
     * 
     * Starts up the workspace after a successful session is establshed
     */
    init: function () {
        
        // Ensure the session
        if (nodedit.session()) {
            // Load the workspace
            nodedit.template('workspace.tpl')
                .done(function (tmpl) {
                    // Load DOM
                    nodedit.$el.html(tmpl);
                    // Start filemanager
                    nodedit.filemanager.init();
                    // Start editor
                    nodedit.editor.init();
                });
        } else {
            // Failed session
            nodedit.message.error('Could not load session');
        }
        
    }
    
};/**
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
        nodedit.$el.find(_this.el).children('li').filterByData('id', id).remove();
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
        nodedit.$el.find(_this.el).children('li').filterByData('id', id).addClass('active');
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
        nodedit.$el.find(_this.el).children('li').filterByData('id', id).on('click', 'a', function () {
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
        nodedit.$el.find(_this.el).children('li').filterByData('id', id).on('click', function () {
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
    
};/**
 * @object nodedit.filemanager
 * 
 * Handles all filemanager related actions
 */
nodedit.filemanager = {
    
    el: '#filemanager',
    
    clipboard: '',

    /**
     * @method nodedit.filemanager.init
     * 
     * Starts the filemanager
     */
    init: function () {
        var _this = this,
            root;
        nodedit.template('filemanager.tpl')
            .done(function (tmpl) {
                // Load DOM
                nodedit.$el.find(_this.el).html(tmpl);
                // Open root 
                _this.openDirectory('/'); 
            });
        
        // Bind directory click
        nodedit.$el.find(_this.el).on('click', 'a.directory', function () {
            var path = $(this).parent('li').data('path');
            if($(this).parent('li').hasClass('open')) {
                _this.closeDirectory(path);
            } else {
                _this.openDirectory(path);
            }
        });
        
        // Bind file click
        nodedit.$el.find(_this.el).on('click', 'a.file', function () {
            nodedit.filemanager.openFile($(this).parent('li').data('path'));
        });
        
        // Bind context menu
        nodedit.$el.find(_this.el).on('contextmenu', 'a', function (e) {
            _this.contextMenu($(this).attr('class'), $(this).parent('li').data('path'), e);
        });
        
        // Bind Exit Button
        nodedit.$el.find(_this.el).on('click', '#disconnect', function () {
            nodedit.connect.close();
        });
    },
    
    /**
     * @method nodedit.filemanager.contextMenu
     * 
     * Shows the appropriate context menu
     * @param {string} type Directory or file
     * @param {path} The path of the element
     */
    contextMenu: function (type, path, e) {
        // Prevent default context menu
        e.preventDefault();
        
        var _this = this,
            object = nodedit.$el.find(_this.el).find('li').filterByData('path', path).children('a'),
            tplDir;
            
        (type==='directory') ? tplDir = 'dir' : tplDir = null;
        
        nodedit.template('filemanager_context_menu.tpl', { dir: tplDir, clipboard: _this.clipboard }, function (tmpl) {
            nodedit.$el.find(_this.el).append(tmpl);
            nodedit.$el.find(_this.el).children('.context-menu').css({
                top: e.pageY-20,
                left: e.pageX-20
            });
            
            // Highlight object
            object.addClass('menu-open');
            
            // Bind item click
            $('.context-menu').on('click', 'a', function () {
               switch ($(this).attr('id')) {     
                    case 'new_file':
                        _this.createObject(path, 'file');
                        break;
                    case 'new_directory':
                        _this.createObject(path, 'directory');
                        break;
                    case 'rename':
                        _this.renameObject(path);
                        break;
                    case 'copy':
                        _this.copyObject(path);
                        break;
                    case 'paste':
                        _this.pasteObject(path);
                        break;
                    case 'delete':
                        _this.deleteObject(path);
                        break;
               }   
            });
            
            // Hide on click
            $('body').on('click', function () {
                nodedit.$el.find(_this.el).children('.context-menu').remove();
                // Remove highlighting from node
                object.removeClass('menu-open');
            });
            
            // Hide on mouseleave
            $('.context-menu').on('mouseleave', function () {
                $(this).remove();
                // Remove highlighting from node
                object.removeClass('menu-open');
            });
        });
    },
    
    /**
     * @method nodedit.filemanager.openDirectory
     * 
     * Opens a directory and displays contents
     * @param {string} path The path to load contents of
     */
    openDirectory: function (path) {
        var _this = this;
        nodedit.fsapi.list(path, function (data) {
            if (data) {
                // Add icon property to object
                for (var item in data) {
                    if (data[item].type==='directory') {
                        data[item].icon = 'icon-folder-close';
                    } else {
                        data[item].icon = 'icon-file';
                    }
                }
                // Load and compile template
                nodedit.template('filemanager_dir.tpl', data, function (tmpl) {
                    object = nodedit.$el.find(_this.el+' li').filterByData('path', path);
                    // Open and append content
                    object.addClass('open').append(tmpl);
                    // Change icon (except root)
                    if (object.attr('id')!=='root') {
                        object.children('a').children('span').attr('class','icon-folder-open');
                    }
                });
            } else {
                nodedit.message.error('Could not load directory');
            }
        });
    },
    
    /**
     * @method nodedit.filemanager.closeDirectory
     * 
     * Closes a directory
     * @param {string} path The path to close contents of
     */
    closeDirectory: function (path) {
        var _this = this;
        var object = nodedit.$el.find(_this.el+' li').filterByData('path', path);
        
        // Don't close root
        if (object.attr('id')==='root') {
            return false;
        }
        
        // Close and remove content
        object.removeClass('open').children('ul').remove();
        // Change icon
        object.children('a').children('span').attr('class','icon-folder-close');
    },
    
    /**
     * @method nodedit.filemanager.openFile
     * 
     * Opens a file and instantiates new nodeditor.editor
     * @param {string} path The path of the file
     */
    openFile: function (path) {
        nodedit.fsapi.open(path, function (contents) {
            if (contents) {
                // Returns 'true' on blank file, fix that s#@t
                (contents.toString()==='true') ? contents = '' : contents = contents;
                nodedit.editor.open(path, contents);
            } else {
                nodedit.message.error('Could not open file');
            }
        });
    },
    
    /**
     * @method nodedit.filemanager.saveFile
     * 
     * Saves a file contents
     * @param {string} path The path of the file
     * @param {string} contents The contents to be saved
     * @param {function} fn optional - Callback with status returned
     */
    saveFile: function (path, content, fn) {
        nodedit.fsapi.save(path, content, function (status) {
            // Check status
            if (status) {
                // Show success
                nodedit.message.success('File has been successfully saved');
            } else {
                // Show error
                nodedit.message.error('The file could not be saved');
            }
            
            // Fire callback if preset
            if (fn) {
                fn(status);
            }
            
        });
    },
    
    /**
     * @method nodedit.filemanager.getName
     * 
     * Returns (only) the name of the file
     * @param {string} path The path of the file
     */
    getFileName: function (path) {
        var arrPath = path.split('/');
        return arrPath[arrPath.length-1];
    },
    
    /**
     * @method nodedit.filemanager.getFileExtension
     * 
     * Returns the file extension
     * @param {string} path The path of the file
     */
    getFileExtension: function (path) {
        var arrName = this.getFileName(path).split('.');
        return arrName[arrName.length-1];
    },
    
    /**
     * @method nodedit.filemanager.createObject
     * 
     * Opens dialog and processes new file/directory creation
     * @param {string} path The path of the directory
     * @param {string} type Type of create, file or directory
     */
    createObject: function (path, type) {
        var _this = this,
            newObj,
            newName,
            createType;
        // Open dialog
        nodedit.modal.open(350, 'Create '+type, 'filemanager_create.tpl', {type: type}, function () {
            // Listen for submit
            nodedit.$el.find(nodedit.modal.el).on('submit', 'form', function (e) {
                e.preventDefault();
                newName = $(this).children('[name="name"]').val();
                if (newName==='') {
                    nodedit.message.error('Please enter a '+type+' name');
                } else {
                    newObj = (path + '/' + newName).replace('//','/');
                    // Create object
                    (type==='directory') ? createType = 'dir' : createType = type;
                    nodedit.fsapi.create(newObj, createType, function (res) {
                        if (res) {
                            // Success, create object
                            _this.appendObject(path, newObj, type);
                            // Close modal
                            nodedit.modal.close();
                        } else {
                            // Error
                            nodedit.message.error('Could not create '+type);
                        }
                    });
                }
            });
        });
    },
    
    /**
     * @method nodedit.filemanager.appendObject
     * 
     * Appends a DOM object to the filemanager parent object
     * @param {string} parent The object to append to
     * @param {string} object The object to append
     * @param {string} type The type of object, file/directory
     */
    appendObject: function (parent, object, type) {
        var _this = this,
            parentObj = nodedit.$el.find(_this.el).find('li').filterByData('path', parent),
            name = _this.getFileName(object),
            icon;
            
        // Prevent duplicates
        if (parentObj.find('li').filterByData('path', object).length!==0) {
            return false;
        }
        
        // Ensure folder is open
        if (parentObj.hasClass('open')) {
            (type==='directory') ? icon = 'icon-folder-close' : icon = 'icon-file';
            parentObj.children('ul')
                .append('<li data-path="'+object+'"><a class="'+type+'"><span class="'+icon+'"></span>'+name+'</a></li>');
        }
    },
    
    /**
     * @method nodedit.filemanager.renameObject
     * 
     * Opens dialog and processes file/directory rename
     * @param {string} path The path of the object
     */
    renameObject: function (path) {
        var _this = this,
            origName = _this.getFileName(path),
            object = nodedit.$el.find(_this.el).find('li').filterByData('path', path),
            type,
            newName,
            newObject,
            newPath;
            
        // Don't rename root
        if (object.attr('id')==='root') {
            nodedit.modal.close();
            nodedit.message.error('Cannot rename the node root');
            return false;
        }
        
        // Get type
        (object.children('a').attr('class').indexOf('directory') !== -1) ? type = 'directory' : type = 'file';
        
        // Open dialog
        nodedit.modal.open(350, 'Rename', 'filemanager_rename.tpl', {path: path, name: origName }, function () {
            // Listen for submit
            nodedit.$el.find(nodedit.modal.el).on('submit', 'form', function (e) {
                e.preventDefault();
                newName = $(this).children('[name="name"]').val();
                // Ensure new name is supplied
                if (newName==='' || newName===origName) {
                    nodedit.message.error('Please enter a new '+type+' name');
                } else {
                    // Process rename
                    nodedit.fsapi.rename(path, newName, function (res) {
                        if (res) {
                            // Change object
                            newPath = path.replace(origName, newName);
                            object.data('path',newPath);
                            newObject = object.children('a').html().replace(origName, newName);
                            object.children('a').html(newObject);
                            // Change any children paths
                            if (type==='directory') {
                                // Change any sub-paths
                                $.each(nodedit.$el.find(_this.el).find('li'), function () {
                                    if ($(this).data('path').indexOf(path)===0 && $(this).data('path')!==newPath) {
                                        $(this).data('path', $(this).data('path').replace(path, newPath));   
                                    } 
                                });
                            }
                            // Change any open editor instances
                            nodedit.editor.rename(path, newPath);
                            // Close modal
                            nodedit.modal.close();
                        } else {
                            nodedit.message.error('Could not rename '+type);
                        }    
                    });
                }
            });
        });
    },
    
    /**
     * @method nodedit.filemanager.copyObject
     * 
     * Adds file/directory to the clipboard
     * @param {string} path The path of the object
     */
    copyObject: function (path) {
        var _this = this;
        _this.clipboard = path;
        nodedit.message.success('Copied to clipboard');
    },
    
    /**
     * @method nodedit.filemanager.pasteObject
     * 
     * Pastes object to path from path stored in clipboard
     * @param {string} path The path of the object
     */
    pasteObject: function (path) {
        var _this = this,
            name = _this.getFileName(_this.clipboard),
            type = nodedit.$el.find(_this.el).find('li').filterByData('path', _this.clipboard).children('a').attr('class');
        
        // Create copy
        nodedit.fsapi.copy(_this.clipboard, path+'/'+name, function (res) {
            if (res) {
                // Append to filemanager
                _this.appendObject(path, path+'/'+name, type);
            } else {
                // Copy procedure failed
                nodedit.message.error('Could not create a copy');
            }
        });
    },
    
    /**
     * @method nodedit.filemanager.deleteObject
     * 
     * Opens dialog and processes file/directory delete
     * @param {string} path The path of the object
     */
    deleteObject: function (path) {
        var _this = this;
        
        // Block deleting root
        if (path==='/') {
            nodedit.modal.close();
            nodedit.message.error('Cannot delete the node root');
            return false;
        }
        
        // Open dialog
        nodedit.modal.open(350, 'Delete?', 'filemanager_delete.tpl', {path: path}, function () {
            // Listen for submit
            nodedit.$el.find(nodedit.modal.el).on('submit', 'form', function (e) {
                e.preventDefault();
                // Delete object
                nodedit.fsapi.delete(path, function (res) {
                    if (res) {
                        // Remove object
                        nodedit.$el.find(_this.el).find('li').filterByData('path', path).remove();
                        // Close modal
                        nodedit.modal.close();
                    } else {
                        // Failed to delete
                        nodedit.message.error('Could not delete object');
                    }
                });
            });
        });
    }

};/**
 * @object nodedit.editor
 * 
 * Handles all functions for the editor
 */
nodedit.editor = {
    
    el: '#editor',
    
    instance_el: '#instances',
    
    instances: {},
    instance_modes: {},

    /**
     * @method nodedit.editor.init
     * 
     * Starts the editor
     */
    init: function () {
        var _this = this,
            savebind;
        
        // Load editor template
        nodedit.template('editor.tpl')
            .done(function (tmpl) {
                // Load DOM
                nodedit.$el.find(_this.el).html(tmpl);
                // Adjust height for top-bar
                var calcHeight = nodedit.$el.outerHeight() - nodedit.$el.find('.top-bar').outerHeight(true);
                nodedit.$el.find(_this.el).css({'height':calcHeight+'px'});
            });
        
        // Bind save key
        savebind = new nodedit.keybind({
            code: "ctrl s",
            callback: function () {
                nodedit.editor.saveActive();
            }
        });
        
    },
    
    /**
     * @method nodedit.editor.open
     * 
     * Starts a new editor instance and loads any contents
     * @param {string} path The path of the file
     * @param {string} contents The contents of the file
     */
    open: function (path, content) {
        
        var _this = this,
            ext = nodedit.filemanager.getFileExtension(path),
            mode = _this.getMode(ext),
            editor = [],
            i,
            id,
            exists = false;
        
        // Check for path in instances
        for (i in _this.instances) {
            if (_this.instances[i].path===path) {
                exists = true;
                id = i;
            }
        }
        
        // Check that file instance not already present
        if (!exists) {
            
            // Create new ID
            id = +new Date();
            
            // Add to instances
            _this.instances[id] = {
                path: path,
                content: content
            };
            
            // New Editor Instance
            nodedit.$el.find(_this.instance_el).append('<li class="editor" id="editor'+id+'" data-id="'+id+'"></li>');
            
            // Instantiates Ace editor
            _this.instances[id].editor = ace.edit('editor'+id);
            
            // Set editor mode
            _this.setMode(mode, id);
            
            // Set editor config
            _this.setConfig({
                theme: 'twilight',
                fontsize: 14,
                printmargin: false,
                highlightline: true,
                indentguides: true
            }, id);
            
            // Bind change liistener
            _this.bindChange(id);
            
            // Set contents
            _this.setContent(content, id);
            
            // New tab
            nodedit.tabs.open(id, nodedit.filemanager.getFileName(path));
            
        }
        
        // Show/Goto Instance
        _this.gotoInstance(id);
    },
    
    /**
     * @method nodedit.editor.setConfig
     * 
     * Sets the configuration of the editor
     * @param {object} config Object containing config properties
     * @param {int} id optional The id of the editor instance (or will change all)
     */
    setConfig: function (config, id) {
        var _this = this,
            i,
            setConf = function(_this, config, id) {
                _this.setTheme(config.theme, id);
                _this.setFontSize(config.fontsize, id);
                _this.setPrintMargin(config.printmargin, id);
                _this.setHighlightLine(config.highlightline, id);
                _this.setIndentGuides(config.indentguides, id);    
            };
        
        // Check for ID
        if (id) {
            // Single instance
            setConf(_this,config,id);
        } else {
            // All active instances
            for (i in _this.instances) {
                setConf(_this, config, i);
            }
        }
    },
    
    /**
     * @method nodedit.editor.close
     * 
     * Closes an instance of the editor and associated tab
     * @param {string} path The path of the file
     */
    close: function (id) {
        var _this = this;
        
        // Closes the editor and tab
        var closeIt = function (_this, id) {
            // Close tab
            nodedit.tabs.close(id);
            // Remove editor instance from DOM
            nodedit.$el.find(_this.instance_el).children('li').filterByData('id', id).remove();    
            // Remove instance
            delete _this.instances[id];
        };
        
        // Check for unsaved changes
        if (nodedit.tabs.checkChanged(id)) {            
            // Open dialog
            nodedit.modal.open(500, 'Close Without Saving?', 'editor_confirm_close.tpl', {}, function () {
                // Show diff
                $(nodedit.modal.el).find('#diffreg').html(_this.getDiff(id));
                // Listen for submit
                nodedit.$el.find(nodedit.modal.el).on('submit', 'form', function (e) {
                    e.preventDefault();
                    // Close
                    closeIt(_this, id);
                    // Close modal
                    nodedit.modal.close();
                });
            });
        } else {
            closeIt(_this, id);
        }
    },
    
    /**
     * @method nodedit.editor.getDiff
     * 
     * Returns diff table between starting point and current changes
     * @param {int} id The id of the editor instance
     */
    getDiff: function (id) {
        // Get diff
        var _this = this,
            base = difflib.stringAsLines(_this.instances[id].content),
            newtxt = difflib.stringAsLines(_this.getContent(id)),
            sm = new difflib.SequenceMatcher(base, newtxt),
            opcodes = sm.get_opcodes(),
            diffoutput = diffview.buildView({
                baseTextLines: base,
                newTextLines: newtxt,
                opcodes: opcodes,
                // set the display titles for each resource
                baseTextName: "Base Text",
                newTextName: "New Text",
                contextSize: null,
                viewType: 1
            });
        return diffoutput;
    },
    
    /**
     * @method nodedit.editor.rename
     * 
     * Handles rename of any open files and path changes
     * @param {string} oldPath The existing path
     * @param {string} newPath The new path
     */
    rename: function (oldPath, newPath) {
        var _this = this, i;
        for (i in _this.instances) {
            if (_this.instances[i].path.indexOf(oldPath)===0) {
                // Found, change path
                _this.instances[i].path = _this.instances[i].path.replace(oldPath, newPath);
                // Change tab
                nodedit.tabs.rename(oldPath, newPath, i);
            }
        }  
    },
    
    /**
     * @method nodedit.editor.saveActive
     * 
     * Saves the active instance
     */
    saveActive: function () {
        
        var _this = this,
            id = nodedit.tabs.getActive(),
            content;
        
        // Check for active tab
        if (!id) {
            // No active tabs, show error
            nodedit.message.error('No active files to save');
        } else {
            // Get content
            content = _this.getContent(id);
            // Save file
            nodedit.filemanager.saveFile(_this.instances[id].path, content, function (status) {
                if (status) {
                    // Set tab indicator back to none
                    nodedit.tabs.markUnchanged(id);
                    // Set instance content to new save
                    _this.instances[id].content = content;
                }
            });
        }
        
    },
    
    /**
     * @method nodedit.editor.gotoInstance
     * 
     * Goes to a specific instance (tab)
     * @param {int} id The id of the editor instance
     */
    gotoInstance: function (id) {
        var _this = this;
        
        // Set active tab
        nodedit.tabs.setActive(id);
        
        // Show editor
        nodedit.$el.find(_this.instance_el).children('li').hide();
        nodedit.$el.find(_this.instance_el).children('li').filterByData('id', id).show();
    },
    
    /**
     * @method nodedit.editor.getPath
     * 
     * Returns the path associated with the editor instance
     * @param {int} id The id of the editor instance
     */
    getPath: function(id){
        var _this = this,
            cur_id;
        for (cur_id in _this.instances) {
            if (cur_id == id) {
                return _this.instances[id].path; 
            }
        }
        // Makes it through without return, send false
        return false;
    },
    
    /**
     * @method nodedit.editor.setContent
     * 
     * Sets the content of the editor instance
     * @param {sting} c The content to set
     * @param {int} id The id of the editor instance
     */
    setContent: function (c,id) {
        var _this = this;
        _this.instances[id].editor.getSession().setValue(c);
    },
    
    /**
     * @method nodedit.editor.getContent
     * 
     * Returns the contents from the editor instance
     * @param {int} id The id of the editor instance
     */
    getContent: function(id){
        var _this = this;
        return _this.instances[id].editor.getSession().getValue();
    },
    
    
    /**
     * @method nodedit.editor.getMode
     * 
     * Returns the correct mode based on extension
     * @param {string} ext The extension of the file
     */
    getMode: function (ext) {
        switch (ext) {
            case 'html': case 'htm': case 'tpl': return 'html';
            case 'js': return 'javascript';
            case 'css': return 'css';
            case 'scss': case 'sass': return 'scss';
            case 'less': return 'less';
            case 'php': case 'php5': return 'php';
            case 'json': return 'json';
            case 'xml': return 'xml';
            case 'sql': return 'sql';
            case 'md': return 'markdown';
            default: return 'text';
        }
    },
    
    /**
     * @method nodedit.editor.setMode
     * 
     * Sets the mode of the editor instance
     * @param {sting} m The mode to set
     * @param {int} id The id of the editor instance
     */
    setMode: function (m,id) {
        var _this = this;
        _this.instances[id].editor.getSession().setMode("ace/mode/"+m);
    },
    
    /**
     * @method nodedit.editor.setTheme
     * 
     * Sets the theme of the editor instance
     * @param {sting} t The theme to set
     * @param {int} id The id of the editor instance
     */
    setTheme: function (t,id) {
        var _this = this;
        _this.instances[id].editor.setTheme("ace/theme/"+t);
    },
    
    /**
     * @method nodedit.editor.setFontSize
     * 
     * Sets the font size for the editor
     * @param {int} s The size of the font
     * @param {int} id The id of the editor instance
     */
    setFontSize: function (s,id) {
        var _this = this;
        _this.instances[id].editor.setFontSize(s);
    },
    
    /**
     * @method nodedit.editor.setHighlightLine
     * 
     * Sets whether or not the active line will be highlighted
     * @param {bool} h Whether or not to highlight active line
     * @param {int} id The id of the editor instance
     */
    setHighlightLine: function (h,id) {
        var _this = this;
        _this.instances[id].editor.setHighlightActiveLine(h);
    },
    
    /**
     * @method nodedit.editor.setPrintMargin
     * 
     * Sets whether or not the print margin will be shown
     * @param {bool} p The mode to set
     * @param {int} id The id of the editor instance
     */
    setPrintMargin: function (p,id) {
        var _this = this;
        _this.instances[id].editor.setShowPrintMargin(p);
    },
    
    /**
     * @method nodedit.editor.setIndentGuides
     * 
     * Sets whether or not indent guides will be shown
     * @param {bool} g Whether or not to show indent guides
     * @param {int} id The id of the editor instance
     */
    setIndentGuides: function (g,id) {
        var _this = this;
        _this.instances[id].editor.setDisplayIndentGuides(g);
    },
    
    /**
     * @method nodedit.editor.bindChange
     * 
     * Binds to change event on editor instance
     * @param {int} id The id of the editor instance
     */
    bindChange: function (id) {
        var _this = this;
        _this.instances[id].editor.on('change', function () {
            nodedit.tabs.markChanged(id);
        });
    }
    
    
};