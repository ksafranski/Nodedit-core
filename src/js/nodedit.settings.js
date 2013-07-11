/**
 * @object nodedit.settings
 * 
 * Hanldes settings get and set
 */
nodedit.settings = {
    
    /**
     * @method nodedit.settings.init
     * 
     * Checks for saved settings or sets defaults
     */
    init: function () {
        // Check for local storage
        if (!nodedit.store('nodedit_settings')) {
            // Set defaults
            nodedit.store('nodedit_settings', {
                theme: 'twilight',
                fontsize: 14,
                printmargin: false,
                highlightline: true,
                indentguides: true
            });
        }
    },
    
    /**
     * @method nodedit.settings.get
     * 
     * Returns the settings from localstorage
     */
    get: function () {
        return JSON.parse(nodedit.store('nodedit_settings'));
    },
    
    /**
     * @method nodedit.settings.set
     * 
     * Stores settings
     * @param {object} settings The object with user settings
     */
    set: function (settings) {
        nodedit.store('nodedit_settings', settings);
        // Update editors
        nodedit.editor.setConfig();
    },
    
    /**
     * @method nodedit.settings.edit
     * 
     * Opens the settings dialog and handles for response
     */
    edit: function () {
        var _this = this,
            settings = _this.get();
        
        // Open settings dialog in modal
        nodedit.modal.open(500, 'Settings', 'settings.tpl', settings, function () {
            // Listen for changes - update settings real-time
            var isBool = function (v) {
                if (v==='true') {
                    return true;
                } else if (v==='false') {
                    return false;
                } else {
                    return v;
                }
            };
            nodedit.$el.find(nodedit.modal.el).on('change', 'select', function (e) {
                settings[$(this).attr('name')] = isBool($(this).val());
                _this.set(settings);
            });
        });
    }
    
};