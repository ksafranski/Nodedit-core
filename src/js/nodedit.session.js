/**
 * Sets or gets session information
 * @method nodedit.session()
 * @param {object|string} arg With format { url: 'ENDPOINT', key: 'API_KEY' } sets the session, 'clear' removes it, no value returns current session (or bool false)
 */
nodedit.session = function () {
    
    // Set or get
    if (arguments.length) {
        if (typeof arguments[0] === 'object') {
            // Session object passed in; store
            nodedit.store('nodedit_session', arguments[0]); 
        } else if (arguments[0] === 'clear') {
            // Clear session
            nodedit.store('nodedit_session', null);
        }
    } else {
        // No object passed
        if (nodedit.store('nodedit_session')) {
            // Session set, return data
            var session = JSON.parse(nodedit.store('nodedit_session'));
            return {
                url: session.url,
                key: session.key
            };
        } else {
            // No session, return false
            return false;
        }
    }
    
};