/**
 * Stores and retrieves data from localstorage
 * @method nodedit.store()
 * @param {string} The key used to identify the storage obejct
 * @param {object|string} [value] The value to set, null to remove object, or not specified to get
 */
nodedit.store = function (key, value) {

    // If value is detected, set new or modify store
    if (typeof value !== "undefined" && value !== null) {
        // Stringify objects
        if(typeof value === "object") {
            value = JSON.stringify(value);
        }
        // Add to / modify storage
        localStorage.setItem(key, value);
    }

    // No value supplied, return value
    if (typeof value === "undefined") {
        return localStorage.getItem(key);
    }

    // Null specified, remove store
    if (value === null) {
        localStorage.removeItem(key);
    }

};