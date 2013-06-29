/**
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
        var _this = this;
        _this.setTheme(config.theme, id);
        _this.setFontSize(config.fontsize, id);
        _this.setPrintMargin(config.printmargin, id);
        _this.setHighlightLine(config.highlightline, id);
        _this.setIndentGuides(config.indentguides, id);
    },
    
    /**
     * @method nodedit.editor.close
     * 
     * Closes an instance of the editor and associated tab
     * @param {string} path The path of the file
     */
    close: function (id) {
        var _this = this;
        // Close tab
        nodedit.tabs.close(id);
        // Remove editor instance from DOM
        nodedit.$el.find(_this.instance_el).children('li[data-id="'+id+'"]').remove();    
        // Remove instance
        delete _this.instances[id];
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
        nodedit.$el.find(_this.instance_el).children('li[data-id="'+id+'"]').show();
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