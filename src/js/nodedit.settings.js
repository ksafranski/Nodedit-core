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
        nodedit.modal.open(500, 'Rename', 'settings.tpl', settings, function () {
            // Listen for submit
            nodedit.$el.find(nodedit.modal.el).on('submit', 'form', function (e) {
                
            });
        });
    }
    
};