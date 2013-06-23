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
        var _this = this;
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
            console.log('open');
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
                    if (path!=='/') {
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
    }

};