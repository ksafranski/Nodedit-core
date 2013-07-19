/**
 * Creates namespace for individual plugins
 * @namespace nodedit.plugin
 */
nodedit.plugin = {};

/**
 * Handles activation and integration of plugins
 * @namespace nodedit.plugins
 */
nodedit.plugins = {
    
    /**
     * Checks plugins/plugins.json and loads up plugins
     * @method nodedit.plugins.init
     */
    init: function () {
        var _this = this,
            plugin;
        
        // Set plugin_dir based on environment
        if(nodedit.env==='dist') {
            nodedit.plugins.plugin_dir = 'plugins/';
        } else {
            nodedit.plugins.plugin_dir = '../plugins/';
        }
        
        // Get plugins
        $.get(nodedit.plugins.plugin_dir+'plugins.json', function (list) {
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
        var _this = this,
            script = document.createElement( 'script' ),
            plugin,
            i, z;
        
        $.get(_this.plugin_dir+directory+'/plugin.js', function (plugin) {
            // This is an appropriate use-case for eval(). I don't want to see an issue in GitHub about
            // eval === evil unless you have imperical proof and code showing a more efficient way to 
            // accomplish this...
            plugin = eval(plugin);
            
            // Check for and load dependencies
            if (plugin.hasOwnProperty('dependencies') && plugin.dependencies.length>0) {
                for (i=0, z=plugin.dependencies.length; i<z; i++) {
                    _this.loadDependency(nodedit.plugins.plugin_dir+directory+'/'+plugin.dependencies[i]);
                }
            }
        });
    },
    
    /**
     * Load plugin dependencies
     * @method nodedit.plugins.loadDependency
     * @param {string} path The path to the dependency
     */
    loadDependency: function(path) {
        var _this = this;
        console.log('Load '+path);
    }
    
};