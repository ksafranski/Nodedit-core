/**
 * Hanldes settings get and set
 * @namespace nodedit.settings
 */
nodedit.settings = {
    
    /**
     * Checks for saved settings or sets defaults
     * @method nodedit.settings.init
     */
    init: function () {
        // Check for local storage
        if (!nodedit.store("nodedit_settings")) {
            // Set defaults
            nodedit.store("nodedit_settings", {
                theme: "twilight",
                fontsize: 14,
                printmargin: false,
                highlightline: true,
                indentguides: true,
                wrapping: false
            });
        }
    },
    
    /**
     * Returns the settings from localStorage
     * @method nodedit.settings.get
     */
    get: function () {
        return JSON.parse(nodedit.store("nodedit_settings"));
    },
    
    /**
     * Stores settings in localStorage
     * @method nodedit.settings.set
     * @param {object} settings The object with user settings
     */
    set: function (settings) {
        nodedit.store("nodedit_settings", settings);
        // Update editors
        nodedit.editor.setConfig();
    },
    
    /**
     * Opens the settings dialog and handles for response
     * @method nodedit.settings.edit
     */
    edit: function () {
        var _this = this,
            settings = _this.get();
        
        // Open settings dialog in modal
        nodedit.modal.open(500, "Settings", "settings.tpl", settings, function () {
            // Listen for changes - update settings real-time
            var isBool = function (v) {
                if (v==="true") {
                    return true;
                } else if (v==="false") {
                    return false;
                } else {
                    return v;
                }
            };
            nodedit.$el.find(nodedit.modal.el).on("change", "select", function (e) {
                settings[$(this).attr("name")] = isBool($(this).val());
                _this.set(settings);
            });
        });
    }
    
};