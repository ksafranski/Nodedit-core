/**
 * Handles all filemanager related actions
 * @namespace nodedit.filemanager
 */
nodedit.filemanager = {
    
    el: "#filemanager",
    
    clipboard: null,
    
    root_name: "Node Root",

    /**
     * Starts the filemanager
     * @method nodedit.filemanager.init
     */
    init: function () {
        var _this = this,
            root = "/",
            root_name = _this.root_name,
            isBookmark = false;
            
        // Clear out filemanager
        nodedit.$el.find(_this.el).html("");
            
        // Check for bookmark
        if (nodedit.bookmarks.getCurrent()) {
            root = nodedit.bookmarks.getCurrent().path;
            root_name = nodedit.bookmarks.getCurrent().name;
            isBookmark = true;
        }
        
        // Check and destroy resize binding
        if (_this.hasOwnProperty("bound")) {
            nodedit.$el.find(_this.el).resizable( "destroy" );
        }
        
        // Load up filemanager
        nodedit.template("filemanager.tpl", {root: root, root_name: root_name, bookmark: isBookmark}, function (tmpl) {
            // Load DOM
            nodedit.$el.find(_this.el).html(tmpl);
            // Open root 
            _this.openDirectory(root); 
            // Bind actions
            _this.bindActions();
        });
    },
    
    /**
     * Binds dom elements to actions
     * @method nodedit.filemanager.bindActions
     */
    bindActions: function () {
        var _this = this;
        
        // Resize
        nodedit.$el.find(_this.el).resizable({  
            handles: { "e": "#resize-handle", "w": "#resize-handle" },
            minWidth: 65,
            resize: function(event, ui){
                // Resize editors
                nodedit.editor.resize(ui.size.width+"px");
            }
        });
        
        // Prevent re-binds
        if (!_this.hasOwnProperty("bound")) {
            
            // Bind directory click
            nodedit.$el.find(_this.el).on("click", "a.directory", function () {
                var path = $(this).parent("li").data("path");
                if($(this).parent("li").hasClass("open")) {
                    _this.closeDirectory(path);
                } else {
                    _this.openDirectory(path);
                }
            });
            
            // Bind file click
            nodedit.$el.find(_this.el).on("click", "a.file", function () {
                nodedit.filemanager.openFile($(this).parent("li").data("path"));
            });
            
            // Add data transfer to jQ props
            $.event.props.push("dataTransfer");
            // Bind Upload Handlers
            nodedit.$el.find(_this.el).on("dragover", "a.directory", function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
                $(".dragover").removeClass("dragover");
                $(this).addClass("dragover");
                // Remove class
                nodedit.$el.on("mouseover dragover", function () {
                    $(".dragover").removeClass("dragover");
                });
            });
            
            // Bind drop of files
            nodedit.$el.find(_this.el).on("drop", "a.directory", function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this.uploadDropFiles(e, $(this).parent("li").data("path"));
            });
            
            // Bind context menu
            nodedit.$el.find(_this.el).on("contextmenu", "a", function (e) {
                if($(this).parent().attr("class") !== "top-bar") {
                    _this.contextMenu($(this).attr("class"), $(this).parent("li").data("path"), e);
                }
            });
            
            // Bind Exit Button
            nodedit.$el.find(_this.el).on("click", "#disconnect", function () {
                nodedit.connect.close();
            });
            
            // Bind Bookmarks Button
            nodedit.$el.find(_this.el).on("click", "#bookmarks", function (e) {
                nodedit.bookmarks.showList(e);
            });
            
            // Bind Plugins Button
            nodedit.$el.find(_this.el).on("click", "#plugins", function (e) {
                nodedit.plugins.showList(e);
            });
            
            // Bind Settings Button
            nodedit.$el.find(_this.el).on("click", "#settings", function () {
                nodedit.settings.edit();
            });
            
            // Bind Rescan Buton
            // Bind Settings Button
            nodedit.$el.find(_this.el).on("click", "#rescan", function () {
                _this.rescan();
            });
            
            // Set re-bind prevention property
            _this.bound = true;
            
        }
    },
    
    /**
     * Shows the appropriate context menu
     * @method nodedit.filemanager.contextMenu
     * @param {string} type Directory or file
     * @param {string} path The path of the element
     * @param {object} e The event object
     */
    contextMenu: function (type, path, e) {
        
        // Remove existing context menus
        nodedit.$el.find(this.el).find(".context-menu").remove();
        
        // Prevent default context menu
        e.preventDefault();
        
        var _this = this,
            object = nodedit.$el.find(_this.el).find("li").filterByData("path", path).children("a"),
            tplDir;
            
        (type==="directory") ? tplDir = "dir" : tplDir = null;
        
        nodedit.template("filemanager_context_menu.tpl", { dir: tplDir, clipboard: _this.clipboard }, function (tmpl) {
            nodedit.$el.find(_this.el).append(tmpl);
            nodedit.$el.find(_this.el).children(".context-menu").css({
                top: e.pageY-20,
                left: e.pageX-20
            });
            
            // Highlight object
            object.addClass("menu-open");
            
            // Bind item click
            $(".context-menu").on("click", "a", function () {
                switch ($(this).attr("id")) {     
                case "new_file":
                    _this.createObject(path, "file");
                    break;
                case "new_directory":
                    _this.createObject(path, "directory");
                    break;
                case "bookmark":
                    nodedit.bookmarks.addBookmark({ name: _this.getFileName(path), path: path });
                    break;
                case "rename":
                    _this.renameObject(path);
                    break;
                case "copy":
                    _this.copyObject(path);
                    break;
                case "paste":
                    _this.pasteObject(path);
                    break;
                case "delete":
                    _this.deleteObject(path);
                    break;
                }   
            });
            
            // Hide on click
            $("body").on("click", function () {
                nodedit.$el.find(_this.el).children(".context-menu").remove();
                // Remove highlighting from node
                object.removeClass("menu-open");
            });
            
            // Hide on mouseleave
            $(".context-menu").on("mouseleave", function () {
                $(this).remove();
                // Remove highlighting from node
                object.removeClass("menu-open");
            });
        });
    },
    
    /**
     * Handles uploading of files dropped
     * @method nodedit.filemanager.uploadDropFiles
     * @param {object} e The event object
     * @param {string} path The drop path
     */
    uploadDropFiles: function (e, path) {        
        var _this = this;
        
        $.each(e.dataTransfer.files, function () {
            var file = this, reader = new FileReader(), content, object;
            reader.onload = function () {
                content = this.result;
                (path!=="/") ? object = path+"/"+file.name : object = path+file.name;
                
                nodedit.fsapi.createFile(object, function (res) {
                    if (res) {
                        nodedit.fsapi.save(object, content, function (res) {
                            if (res) {
                                // Success, save object
                                _this.appendObject(path, object, "file");
                                nodedit.message.success("Successfully uploaded "+file.name);
                            } else {
                                nodedit.message.error("Could not save contents of "+file.name);
                            }
                        });
                    } else {
                        // Error
                        nodedit.message.error("Could not create "+file.name);
                    }
                });
            };
            
            // Always read binary to send to server
            reader.readAsBinaryString(file);
            
        });

    },
    
    /**
     * Rescans current directory tree to check for remote syncronization
     * @method nodedit.filemanager.rescan
     */
    rescan: function () {
        var _this = this,
            objects = [],
            i = 0,
            spinner = nodedit.$el.find(_this.el).children("#fm-container").children("#rescan");
            
        // Spinner
        spinner.addClass('icon-spin');
        
        // Populate array
        nodedit.$el.find(_this.el).children("#fm-container").find("li").filterByData("type","directory").each(function () {
            if ($(this).hasClass("open")) {
                objects.push($(this).attr("data-path"));
            }
        });
        
        // Runs the rescan by firing openDirectory, waiting for response publisher, then moving to next iteration
        var runRescan = function(i, objects, spinner, _this) {
            _this.openDirectory(objects[i]);
            // Wait for emitter
            var listen = nodedit.observer.subscribe('filemanager_opendir', function (data) {
                // Ensure correct publish instance
                if (data === objects[i]) {
                    // Unsubscribe the observer
                    nodedit.observer.unsubscribe(listen);
                    if (i<(objects.length)-1) {
                        // Iterate and rescan next node
                        i++;
                        runRescan(i, objects, spinner, _this);
                    } else {
                        // Stop spinner
                        spinner.removeClass('icon-spin');
                    }
                }
            });
        };
        
        // Start rescan
        runRescan(i, objects, spinner, _this);
        
    },
    
    /**
     * Opens a directory and displays contents
     * @method nodedit.filemanager.openDirectory
     * @param {string} path The path to load contents of
     */
    openDirectory: function (path) {
        var _this = this;
        nodedit.fsapi.list(path, function (data) {
            if (data) {
                // Add icon property to object
                for (var item in data) {
                    if (data[item].type==="directory") {
                        data[item].icon = "icon-folder-close";
                    } else {
                        data[item].icon = "icon-file";
                    }
                }
                // Load and compile template
                nodedit.template("filemanager_dir.tpl", data, function (tmpl) {
                    var object;
                    object = nodedit.$el.find(_this.el+" li").filterByData("path", path);
                    // Remove any existing content (rescan)
                    object.children("ul").remove();
                    // Open and append content
                    object.addClass("open").append(tmpl);
                    // Change icon (except root)
                    if (object.attr("id")!=="root") {
                        object.children("a").children("span").attr("class","icon-folder-open");
                    }
                    // Fire emitter (short timeout allows DOM to catch-up on large traversals)
                    setTimeout(function() {
                        nodedit.observer.publish('filemanager_opendir', path);
                    }, 15);
                    
                });
            } else {
                nodedit.message.error("Could not load directory");
            }
        });
    },
    
    /**
     * Closes a directory
     * @method nodedit.filemanager.closeDirectory
     * @param {string} path The path to close contents of
     */
    closeDirectory: function (path) {
        var _this = this;
        var object = nodedit.$el.find(_this.el+" li").filterByData("path", path);
        
        // Don"t close root
        if (object.attr("id")==="root") {
            return false;
        }
        
        // Close and remove content
        object.removeClass("open").children("ul").remove();
        // Change icon
        object.children("a").children("span").attr("class","icon-folder-close");
    },
    
    /**
     * Opens a file and instantiates new nodeditor.editor
     * @method nodedit.filemanager.openFile
     * @param {string} path The path of the file
     */
    openFile: function (path) {
        nodedit.fsapi.open(path, function (contents) {
            if (contents) {
                // Returns "true" on blank file, fix that s#@t
                (contents.toString()==="true") ? contents = "" : contents = contents;
                nodedit.editor.open(path, contents);
            } else {
                nodedit.message.error("Could not open file");
            }
        });
    },
    
    /**
     * Saves a file contents
     * @method nodedit.filemanager.saveFile
     * @param {string} path The path of the file
     * @param {string} contents The contents to be saved
     * @param {requestCallback} [fn] Callback with status returned
     */
    saveFile: function (path, content, fn) {
        nodedit.fsapi.save(path, content, function (status) {
            // Check status
            if (status) {
                // Show success
                nodedit.message.success("File has been successfully saved");
            } else {
                // Show error
                nodedit.message.error("The file could not be saved");
            }
            
            // Fire callback if preset
            if (fn) {
                fn(status);
            }
            
        });
    },
    
    /**
     * Returns (only) the name of the file
     * @method nodedit.filemanager.getName
     * @param {string} path The path of the file
     */
    getFileName: function (path) {
        var arrPath = path.split("/");
        return arrPath[arrPath.length-1];
    },
    
    /**
     * Returns the file extension
     * @method nodedit.filemanager.getFileExtension
     * @param {string} path The path of the file
     */
    getFileExtension: function (path) {
        var arrName = this.getFileName(path).split(".");
        return arrName[arrName.length-1];
    },
    
    /**
     * Opens dialog and processes new file/directory creation
     * @method nodedit.filemanager.createObject
     * @param {string} path The path of the directory
     * @param {string} type Type of create, file or directory
     */
    createObject: function (path, type) {
        var _this = this,
            newObj,
            newName,
            createType;
        // Open dialog
        nodedit.modal.open(350, "Create "+type, "filemanager_create.tpl", {type: type}, function () {
            // Listen for submit
            nodedit.$el.find(nodedit.modal.el).on("submit", "form", function (e) {
                e.preventDefault();
                newName = $(this).children("[name=\"name\"]").val();
                if (newName==="") {
                    nodedit.message.error("Please enter a "+type+" name");
                } else {
                    newObj = (path + "/" + newName).replace("//","/");
                    // Create object
                    (type==="directory") ? createType = "dir" : createType = type;
                    nodedit.fsapi.create(newObj, createType, function (res) {
                        if (res) {
                            // Success, create object
                            _this.appendObject(path, newObj, type);
                            // Close modal
                            nodedit.modal.close();
                        } else {
                            // Error
                            nodedit.message.error("Could not create "+type);
                        }
                    });
                }
            });
        });
    },
    
    /**
     * Appends a DOM object to the filemanager parent object
     * @method nodedit.filemanager.appendObject
     * @param {string} parent The object to append to
     * @param {string} object The object to append
     * @param {string} type The type of object, file/directory
     */
    appendObject: function (parent, object, type) {
        var _this = this,
            parentObj = nodedit.$el.find(_this.el).find("li").filterByData("path", parent),
            name = _this.getFileName(object),
            icon;
            
        // Prevent duplicates
        if (parentObj.find("li").filterByData("path", object).length!==0) {
            return false;
        }
        
        // Ensure folder is open
        if (parentObj.hasClass("open")) {
            (type==="directory") ? icon = "icon-folder-close" : icon = "icon-file";
            parentObj.children("ul")
                .append("<li data-path=\""+object+"\"><a class=\""+type+"\"><span class=\""+icon+"\"></span>"+name+"</a></li>");
        }
    },
    
    /**
     * Opens dialog and processes file/directory rename
     * @method nodedit.filemanager.renameObject
     * @param {string} path The path of the object
     */
    renameObject: function (path) {
        var _this = this,
            origName = _this.getFileName(path),
            object = nodedit.$el.find(_this.el).find("li").filterByData("path", path),
            type,
            newName,
            newObject,
            newPath;
            
        // Don"t rename root
        if (object.attr("id")==="root") {
            nodedit.modal.close();
            nodedit.message.error("Cannot rename the node root");
            return false;
        }
        
        // Get type
        (object.children("a").attr("class").indexOf("directory") !== -1) ? type = "directory" : type = "file";
        
        // Open dialog
        nodedit.modal.open(350, "Rename", "filemanager_rename.tpl", {path: path, name: origName }, function () {
            // Listen for submit
            nodedit.$el.find(nodedit.modal.el).on("submit", "form", function (e) {
                e.preventDefault();
                newName = $(this).children("[name=\"name\"]").val();
                // Ensure new name is supplied
                if (newName==="" || newName===origName) {
                    nodedit.message.error("Please enter a new "+type+" name");
                } else {
                    // Process rename
                    nodedit.fsapi.rename(path, newName, function (res) {
                        if (res) {
                            // Change object
                            newPath = path.replace(origName, newName);
                            object.data("path",newPath);
                            newObject = object.children("a").html().replace(origName, newName);
                            object.children("a").html(newObject);
                            // Change any children paths
                            if (type==="directory") {
                                // Change any sub-paths
                                $.each(nodedit.$el.find(_this.el).find("li"), function () {
                                    if ($(this).data("path").indexOf(path)===0 && $(this).data("path")!==newPath) {
                                        $(this).data("path", $(this).data("path").replace(path, newPath));   
                                    } 
                                });
                            }
                            // Change any open editor instances
                            nodedit.editor.rename(path, newPath);
                            // Close modal
                            nodedit.modal.close();
                        } else {
                            nodedit.message.error("Could not rename "+type);
                        }    
                    });
                }
            });
        });
    },
    
    /**
     * Adds file/directory to the clipboard
     * @method nodedit.filemanager.copyObject
     * @param {string} path The path of the object
     */
    copyObject: function (path) {
        var _this = this;
        _this.clipboard = path;
        nodedit.message.success("Copied to clipboard");
    },
    
    /**
     * Pastes object to path from path stored in clipboard
     * @method nodedit.filemanager.pasteObject
     * @param {string} path The path of the object
     */
    pasteObject: function (path) {
        var _this = this,
            name = _this.getFileName(_this.clipboard),
            type = nodedit.$el.find(_this.el).find("li").filterByData("path", _this.clipboard).children("a").attr("class");
            
        // Check for duplicate condition
        if(nodedit.$el.find(_this.el).find("li").filterByData("path", path+"/"+name).length>0) {
            name = "copy_of_"+name;
        }
        
        // Create copy
        nodedit.fsapi.copy(_this.clipboard, path+"/"+name, function (res) {
            if (res) {
                // Append to filemanager
                _this.appendObject(path, path+"/"+name, type);
            } else {
                // Copy procedure failed
                nodedit.message.error("Could not create a copy");
            }
        });
    },
    
    /**
     * Opens dialog and processes file/directory delete
     * @method nodedit.filemanager.deleteObject
     * @param {string} path The path of the object
     */
    deleteObject: function (path) {
        var _this = this;
        
        // Block deleting root
        if (path==="/") {
            nodedit.modal.close();
            nodedit.message.error("Cannot delete the node root");
            return false;
        }
        
        // Open dialog
        nodedit.modal.open(350, "Delete?", "filemanager_delete.tpl", {path: path}, function () {
            // Listen for submit
            nodedit.$el.find(nodedit.modal.el).on("submit", "form", function (e) {
                e.preventDefault();
                // Delete object
                nodedit.fsapi.delete(path, function (res) {
                    if (res) {
                        // Remove object
                        nodedit.$el.find(_this.el).find("li").filterByData("path", path).remove();
                        // Close modal
                        nodedit.modal.close();
                    } else {
                        // Failed to delete
                        nodedit.message.error("Could not delete object");
                    }
                });
            });
        });
    }

};
