/**
 * Handles all functions for the editor
 * @namespace nodedit.editor
 */
nodedit.editor = {
    
    el: "#editor",
    
    instance_el: "#instances",
    
    instances: {},
    instance_modes: {},

    /*
    Here you can define the available editor extensions, the format is a valid json array, each key of the array is the extensions used and the value of that element is the editor type that should be interpreted.
    */

    available_extensions: {
        "coffee": "coffee",
        "css": "css",
        "html": "html",
        "htm": "html",
        "tpl": "html",
        "twig": "html",
        "js": "javascript",
        "json": "json",
        "jsp": "jsp",
        "less": "less",
        "md": "markdown",
        "php": "php",
        "php5": "php",
        "py": "python",
        "rb": "ruby",
        "sass": "sass",
        "scss": "scss",
        "sh": "sh",
        "sql": "sql",
        "txt": "text",
        "text": "text",
        "xml": "xml",
        "svg": "xml"  
    }, 

    /**
     * Starts the editor
     * @method nodedit.editor.init
     */
    init: function () {
        var _this = this,
            savebind,
            observer = nodedit.observer;
        
        // Load editor template
        nodedit.template("editor.tpl")
            .done(function (tmpl) {
                // Load DOM
                nodedit.$el.find(_this.el).html(tmpl);
                // Adjust height for top-bar
                var calcHeight = nodedit.$el.outerHeight() - nodedit.$el.find(".top-bar").outerHeight(true);
                nodedit.$el.find(_this.el).css({"height":calcHeight+"px"});
            });
        
        // Bind save key
        savebind = new nodedit.keybind({
            code: "ctrl s",
            callback: function () {
                nodedit.editor.saveActive();
            }
        });
        
        // Subscribe to changes to editors
        observer.subscribe("editor_change", function (id) {
            nodedit.tabs.markChanged(id);
        });
        
        // Subscribe to cursor change
        observer.subscribe("editor_cursor", function (pos_data) {
            var position = nodedit.$el.find(_this.el).children('#position');
            clearTimeout(_this.postimer);
            position.css({ 'opacity': 0.7 });
            position.children('.ln').html('Line '+pos_data.line);
            position.children('.ch').html('Char '+pos_data.char);
            _this.postimer = setTimeout(function () {
                position.css({ 'opacity': 0.3 });
            }, 1000);
            
        });
        
    },
    
    /**
     * Starts a new editor instance and loads any contents
     * @method nodedit.editor.open
     * @param {string} path The path of the file
     * @param {string} contents The contents of the file
     */
    open: function (path, content) {
        
        var _this = this,
            ext = nodedit.filemanager.getFileExtension(path),
            mode = _this.getMode(ext),
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
        
        // Check for invalid mode/extension
        if (!mode) {
            // Mode not supported
            nodedit.message.error("Can not open file type "+ext);
            return false;
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
            nodedit.$el.find(_this.instance_el).append("<li class=\"editor\" id=\"editor"+id+"\" data-id=\""+id+"\"></li>");
            
            // Instantiates Ace editor
            _this.instances[id].editor = ace.edit("editor"+id);
            
            // Set editor mode
            _this.setMode(mode, id);
            
            // Set editor config from settings
            _this.setConfig(id);

            // Bind to emitter
            _this.emitter(id);
            
            // Bind context menu
            _this.bindContextMenu(id);
            
            // Set contents
            _this.setContent(content, id);
            
            // New tab
            nodedit.tabs.open(id);
            
            // Focus
            _this.instances[id].editor.focus();
            
        }
        
        // Show/Goto Instance
        _this.gotoInstance(id);
    },
    
    /**
     * Sets the configuration of the editor
     * @method nodedit.editor.setConfig
     * @param {object} config Object containing config properties
     * @param {number} [id] The id of the editor instance (or will change all)
     */
    setConfig: function (id) {
        var _this = this,
            config = nodedit.settings.get(),
            i,
            setConf = function(_this, config, id) {
                _this.setTheme(config.theme, id);
                _this.setFontSize(parseInt(config.fontsize,10), id);
                _this.setPrintMargin(config.printmargin, id);
                _this.setHighlightLine(config.highlightline, id);
                _this.setIndentGuides(config.indentguides, id);
                _this.setWrapping(config.wrapping, id);
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
     * Binds the context menu
     * @method nodedit.editor.bindContextMenu
     * @param {number} id The id of the editor
     */
    bindContextMenu: function (id) {
        var _this = this,
            mode;
        _this.instances[id].editor.textInput.onContextMenu = function (e) {
            e.preventDefault();
            
            // Get current mode
            mode = _this.instances[id].mode;
            
            nodedit.template("editor_context_menu.tpl", { id: id, curmode: mode }, function (tmpl) {
                nodedit.$el.find(_this.el).append(tmpl);
                nodedit.$el.find(_this.el).children(".context-menu").css({
                    top: e.pageY-20,
                    left: e.pageX-20
                });
                
                // Bind item click
                $(".context-menu").on("click", "a", function () {
                    switch ($(this).attr("id")) {     
                    case "save":
                        _this.saveActive();
                        break;
                    case "close":
                        _this.close(id);
                        break;
                    case "mode":
                        _this.changeMode(id, mode);
                        break;
                    case "settings":
                        nodedit.settings.edit();
                        break;
                    }
                });
                
                // Hide on mouseleave
                $(".context-menu").on("mouseleave", function (e) {
                    e.stopPropagation();
                    $(this).remove();
                });
            });
        };
    },
    
    /**
     * Opens mode selector dialog and processes change
     * @method nodedit.editor.changeMode
     * @param {number} id The id of the editor instance
     * @param {string} curmode The current selected mode
     */
    changeMode: function (id, curmode) {
        
        var _this = this,
            mode, modes = {}, sel;
        
        // Build available modes array
        for (mode in _this.available_extensions) {
            if ($.inArray(_this.available_extensions[mode], modes) === -1) {
                sel = false;
                if (_this.available_extensions[mode]===curmode) {
                    sel = true;
                }
                modes[_this.available_extensions[mode]] = sel;
            }
        }
        
        // Open dialog
        nodedit.modal.open(350, "Editor Mode", "editor_change_mode.tpl", { modes: modes, curmode: curmode }, function () {
            // Process mode change
            nodedit.$el.find(nodedit.modal.el).find("form").on("submit", function (e) {
                e.preventDefault();
                _this.setMode($(this).children("select[name=\"mode\"]").children("option:selected").val(), id);
                nodedit.modal.close();
            });
        });
        
    },
    
    /**
     * Resizes the editor when the sidebar is resized
     * @method nodedit.editor.resize
     * @param {number} w The width of the sidebar (translates to margin-left of #editor)
     */
    resize: function(w){
        var _this = this,
            i;
        nodedit.$el.find(_this.el).css({ 
            "margin-left": w
        });
        for (i in _this.instances) {
            _this.instances[i].editor.resize();
        }
    },
    
    /**
     * Closes an instance of the editor and associated tab
     * @method nodedit.editor.close
     * @param {number} id The id of the editor instance
     */
    close: function (id) {
        var _this = this;
        
        // Closes the editor and tab
        var closeIt = function (_this, id) {
            // Close tab
            nodedit.tabs.close(id);
            // Remove editor instance from DOM
            nodedit.$el.find(_this.instance_el).children("li").filterByData("id", id).remove();    
            // Remove instance
            delete _this.instances[id];
        };
        
        // Check for unsaved changes
        if (nodedit.tabs.checkChanged(id)) {            
            // Open dialog
            nodedit.modal.open(500, "Close Without Saving?", "editor_confirm_close.tpl", {}, function () {
                // Show diff
                $(nodedit.modal.el).find("#diffreg").html(_this.getDiff(id));
                // Listen for submit
                nodedit.$el.find(nodedit.modal.el).on("submit", "form", function (e) {
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
     * Returns diff table between starting point and current changes
     * @method nodedit.editor.getDiff
     * @param {number} id The id of the editor instance
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
     * Handles rename of any open files and path changes
     * @method nodedit.editor.rename
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
     * Saves the active instance
     * @method nodedit.editor.saveActive
     */
    saveActive: function () {
        
        var _this = this,
            id = nodedit.tabs.getActive(),
            content;
        
        // Check for active tab
        if (!id) {
            // No active tabs, show error
            nodedit.message.error("No active files to save");
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
     * Goes to a specific instance (tab)
     * @method nodedit.editor.gotoInstance
     * @param {number} id The id of the editor instance
     */
    gotoInstance: function (id) {
        var _this = this;
        
        // Set active tab
        nodedit.tabs.setActive(id);
        
        // Show editor
        nodedit.$el.find(_this.instance_el).children("li").hide();
        nodedit.$el.find(_this.instance_el).children("li").filterByData("id", id).show();
    },
    
    /**
     * Returns the path associated with the editor instance
     * @method nodedit.editor.getPath
     * @param {number} id The id of the editor instance
     */
    getPath: function(id){
        var _this = this,
            cur_id;
        for (cur_id in _this.instances) {
            if (parseInt(cur_id,10) === parseInt(id,10)) {
                return _this.instances[id].path; 
            }
        }
        // Makes it through without return, send false
        return false;
    },
    
    /**
     * Sets the content of the editor instance
     * @method nodedit.editor.setContent
     * @param {sting} c The content to set
     * @param {int} id The id of the editor instance
     */
    setContent: function (c,id) {
        var _this = this;
        _this.instances[id].editor.getSession().setValue(c);
    },
    
    /**
     * Returns the contents from the editor instance either by specified id or active
     * @method nodedit.editor.getContent
     * @param {int} [id] The id of the editor instance
     */
    getContent: function(id){
        var _this = this;
            
        // Eiter pull contents of specified editor or get active instance
        id = id || nodedit.tabs.getActive();
            
        // Return data
        if (!id) {
            // No active editor
            return false;
        } else {
            return _this.instances[id].editor.getSession().getValue();    
        } 
    },
    
    
    /**
     * Returns the correct mode based on extension
     * @method nodedit.editor.getMode
     * @param {string} ext The extension of the file
     */
    getMode: function (ext) {
        // Check for hidden (.xxxxxx) files
        (ext.length>4) ? ext = "text" : ext = ext;
        // Is the extensions available?
        if (this.available_extensions[ext]) {
            return this.available_extensions[ext];
        } else {
            return false;
        }
    },
    
    /**
     * Sets the mode of the editor instance
     * @method nodedit.editor.setMode
     * @param {sting} m The mode to set
     * @param {number} id The id of the editor instance
     */
    setMode: function (m,id) {
        var _this = this;
        // Set editor
        _this.instances[id].editor.getSession().setMode("ace/mode/"+m);
        // Store current mode
        _this.instances[id].mode = m;
    },
    
    /**
     * Sets the theme of the editor instance
     * @method nodedit.editor.setTheme
     * @param {sting} t The theme to set
     * @param {number} id The id of the editor instance
     */
    setTheme: function (t,id) {
        var _this = this;
        _this.instances[id].editor.setTheme("ace/theme/"+t);
    },
    
    /**
     * Sets the font size for the editor
     * @method nodedit.editor.setFontSize
     * @param {number} s The size of the font
     * @param {number} id The id of the editor instance
     */
    setFontSize: function (s,id) {
        var _this = this;
        _this.instances[id].editor.setFontSize(s);
    },
    
    /**
     * Sets whether or not the active line will be highlighted
     * @method nodedit.editor.setHighlightLine
     * @param {bool} h Whether or not to highlight active line
     * @param {number} id The id of the editor instance
     */
    setHighlightLine: function (h,id) {
        var _this = this;
        _this.instances[id].editor.setHighlightActiveLine(h);
    },
    
    /**
     * Sets whether or not the print margin will be shown
     * @method nodedit.editor.setPrintMargin
     * @param {bool} p The mode to set
     * @param {number} id The id of the editor instance
     */
    setPrintMargin: function (p,id) {
        var _this = this;
        _this.instances[id].editor.setShowPrintMargin(p);
    },
    
    /**
     * Sets whether or not indent guides will be shown
     * @method nodedit.editor.setIndentGuides
     * @param {bool} g Whether or not to show indent guides
     * @param {number} id The id of the editor instance
     */
    setIndentGuides: function (g,id) {
        var _this = this;
        _this.instances[id].editor.setDisplayIndentGuides(g);
    },
    
    /**
     * Sets whether or not to wrap lines
     * @method nodedit.editor.setWrapping
     * @param {bool} w Whether or not to wrap lines
     * @param {number} id The id of the editor instance
     */
    setWrapping: function(w, id){
        var _this = this;
        _this.instances[id].editor.getSession().setUseWrapMode(w);
    },
    
    /**
     * Binds events to emit through nodedit.observer
     * @method nodedit.editor.emitter
     * @param {number} id The id of the editor instance
     * @fires nodedit.observer.publish#editor_change
     * @fires nodedit.observer.publish#editor_blur
     * @fires nodedit.observer.publish#editor_focus
     * @fires nodedit.observer.publish#editor_cursor
     */
    emitter: function (id) {
        var _this = this,
            observer = nodedit.observer;
        
        /**
         * Editor content change event
         * @event nodedit.observer.publish#editor_change 
         * @type {object}
         * @property {number} id The ID of the editor instance
         */
        _this.instances[id].editor.on("change", function () {
            observer.publish("editor_change", id);
        });
        
        /**
         * Editor blur event
         * @event nodedit.observer.publish#editor_blur 
         * @type {object}
         * @property {number} id The ID of the editor instance
         */
        _this.instances[id].editor.on("blur", function () {
            observer.publish("editor_blur", id);
        });
        
        /**
         * Editor focus event
         * @event nodedit.observer.publish#editor_focus 
         * @type {object}
         * @property {number} id The ID of the editor instance
         */
        _this.instances[id].editor.on("focus", function () {
            observer.publish("editor_focus", id);
        });
        
        /**
         * Editor cursor change event
         * @event nodedit.observer.publish#editor_cursor 
         * @type {object}
         * @property {number} id The ID of the editor instance
         * @property {number} line The current line number
         * @property {number} char The current character position
         * @property {number} top The top coordinate relative to the document
         * @property {number} left The left coordinate relative to the document
         */
        _this.instances[id].editor.selection.on("changeCursor", function () {
            var line, char, cursor_el, cursor_offset, cursor_top, cursor_left;
            // Get line and char
            line = _this.instances[id].editor.getCursorPosition().row + 1;
            char = _this.instances[id].editor.getCursorPosition().column + 1;
            // Get cursor top and left
            cursor_el = nodedit.$el.find(_this.instance_el).children("li").filterByData("id", id).find(".ace_cursor");
            // Force brief delay for DOM catch-up
            setTimeout(function () {
                cursor_offset = cursor_el.offset();
                cursor_top = cursor_offset.top;
                cursor_left = cursor_offset.left;
                nodedit.observer.publish("editor_cursor", { id: id, line: line, char: char, top: cursor_top, left: cursor_left });
            }, 4);
        });
    }
    
};
