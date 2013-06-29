/**
 * @object nodedit.filemanager
 * 
 * Handles all filemanager related actions
 */
nodedit.filemanager = {
    
    el: '#filemanager',

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
            node = nodedit.$el.find(_this.el).find('li[data-path="'+path+'"]').children('a');
        
        nodedit.template('filemanager_'+type+'_menu.tpl', path, function (tmpl) {
            nodedit.$el.find(_this.el).append(tmpl);
            nodedit.$el.find(_this.el).children('.context-menu').css({
                top: e.pageY-20,
                left: e.pageX-20
            });
            
            // Highlight node
            node.addClass('menu-open');
            
            // Hide context menu
            $('body').on('click', function () {
                nodedit.$el.find(_this.el).children('.context-menu').remove();
                // Remove highlighting from node
                node.removeClass('menu-open');
            });
            
            $('.context-menu').on('mouseleave', function () {
                $(this).remove();
                // Remove highlighting from node
                node.removeClass('menu-open');
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
                    var node = nodedit.$el.find(_this.el+' li[data-path="'+path+'"]');
                    // Open and append content
                    node.addClass('open').append(tmpl);
                    // Change icon (except root)
                    if (node.attr('id')!=='root') {
                        node.children('a').children('span').attr('class','icon-folder-open');
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
        var node = nodedit.$el.find(_this.el+' li[data-path="'+path+'"]');
        // Close and remove content
        node.removeClass('open').children('ul').remove();
        // Change icon
        node.children('a').children('span').attr('class','icon-folder-close');
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
     * @method nodedit.filemanage.getFileExtension
     * 
     * Returns the file extension
     * @param {string} path The path of the file
     */
    getFileExtension: function (path) {
        var arrName = this.getFileName(path).split('.');
        return arrName[arrName.length-1];
    }

};