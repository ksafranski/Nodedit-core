/**
 * Creates namespace for individual plugins, no additional native methods or properties
 * @namespace nodedit.plugin
 */
nodedit.plugin = {};

/**
 * Handles activation and integration of plugins
 * @namespace nodedit.plugins
 */
nodedit.plugins = {
    
    plugin_menu: {},
    
    /**
     * Checks plugins/plugins.json and loads up plugins
     * @method nodedit.plugins.init
     */
    init: function () {
        var _this = this;
        
        // Set plugin_dir based on environment
        if(nodedit.env==="dist") {
            nodedit.plugins.plugin_dir = "plugins/";
        } else {
            nodedit.plugins.plugin_dir = "../plugins/";
        }
        
        // Get plugins
        $.getJSON(nodedit.plugins.plugin_dir+"plugins.json", function (list) {
            var plugin;
            for (plugin in list) {
                // Send to register method
                _this.register(plugin, list[plugin]);
            }
        });
    },
    
    /**
     * Registers a plugin by loading plugin.js file
     * @method nodedit.plugins.register
     * @param {string} name The name of the plugin
     * @param {string} directory The directory name inside of /plugins
     */
    register: function (name, directory) {
        var _this = this;
        
        $.get(_this.plugin_dir+directory+"/plugin.js", function (plugin) {
            var tpl;
            // This is an appropriate use-case for eval(). I don"t want to see an issue in GitHub about
            // eval === evil unless you have imperical proof and code showing a more efficient way to 
            // accomplish this...
            plugin = eval(plugin);
            
            // Add to menu list
            if (plugin.hasOwnProperty("onMenu")) {
                _this.plugin_menu[name] = {
                    icon: plugin.icon,
                    object: directory
                };
            }
            
            // Properly path templates
            if (plugin.hasOwnProperty("templates")) {
                for (tpl in plugin.templates) {
                    plugin.templates[tpl] = nodedit.plugins.plugin_dir + directory + "/" + plugin.templates[tpl];
                }
            }
            
            // Check for and load dependencies
            if (plugin.hasOwnProperty("dependencies") && plugin.dependencies.length>0) {
                // Load dep"s
                _this.loadDependencies(plugin.dependencies, nodedit.plugins.plugin_dir+directory+"/", function () {
                    // Fire init (if available)
                    if (plugin.hasOwnProperty("init")) {
                        plugin.init();
                    }
                });
            } else {
                // No dep"s, fire init (if available)
                if (plugin.hasOwnProperty("init")) {
                    plugin.init();
                }
            }
        });
    },
    
    /**
     * Load plugin dependencies
     * @method nodedit.plugins.loadDependencies
     * @param {array} scripts The paths to the dependencies
     * @param {requestCallback} fn The callback to fire on completion
     */
    loadDependencies: function(scripts, base_path, fn) {
        var loadCount = 0,
            totalRequired = scripts.length;
        
        // Record loaded and callback once all scripts loaded
        var loaded = function () {
            loadCount++;
            if (loadCount === totalRequired && typeof fn === "function") {
                fn.call();
            }
        };
        
        // Writes out dependency
        var writeScript = function (src) {
            var ext = src.split(".").pop(),
                s;
                
            if (ext === "js") {
                // Create script ref
                s = document.createElement("script");
                s.type = "text/javascript";
                s.async = true;
                s.src = base_path+src;
                s.addEventListener("load", function (e) { loaded(e); }, false);
                var body = document.getElementsByTagName("body")[0];
                body.appendChild(s);
            } else if (ext === "css") {
                // Create css link
                s = document.createElement("link");    
                s.type = "text/css";
                s.rel = "stylesheet";
                s.href = base_path+src;
                s.async = true;
                s.addEventListener("load", function (e) { loaded(e); }, false);
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(s);
            } else {
                // Not supported, call loaded
                loaded({});
            }
        };
        
        // Loop through dep"s
        for (var i = 0; i < scripts.length; i++) {
            writeScript(scripts[i]);
        }
    },
    
    /**
     * Loads and displays the plugins select list
     * @method nodedit.plugins.showList
     * @param {object} e The event triggering the list display
     */
    showList: function (e) {
        // Create element
        nodedit.$el.append("<div id=\"plugin-menu\"><ul></ul></div>");
        
        var _this = this,
            output = "",
            menu = nodedit.$el.find("#plugin-menu"),
            trigger = nodedit.$el.find(e.target),
            trigger_pos = trigger.position();
            
        if ($.isEmptyObject(_this.plugin_menu)) {
            nodedit.message.error("No plugins have been installed");
            menu.remove();
        } else {
            menu.css({
                // Set top and left relative to trigger
                top: (trigger_pos.top + trigger.outerHeight() + 5)+"px", 
                left: trigger_pos.left-10+"px" 
            })
            .on("mouseleave click", function () {
                // Remove on mouseleave
                menu.remove();
            });
            
            // Loop through and create DOM elements
            for (var plugin in _this.plugin_menu) {
                output += "<li><a onclick=\"nodedit.plugin."+_this.plugin_menu[plugin].object+".onMenu();\"><span class=\""+_this.plugin_menu[plugin].icon+"\"></span> "+plugin+"</a></li>";
            }
            
            // Set in menu and show
            menu.show().children("ul").html(output);
            
        }
    }
    
};