/**
 * Namespace for pub/sub
 * @namespace nodedit.observer
 */
nodedit.observer = {
    
    topics: {},
    
    topic_id: 0,
    
    /**
     * Publishes events to the observer
     * @method nodedit.observer.publish
     * @param {string} name An idenditfier for the observer
     * @param {string|object} data The data associated with the observer
     */
    publish: function (topic, data) {
        var _this = this;
        if (!_this.topics.hasOwnProperty(topic)) {
            return false;
        }
        setTimeout(function () {
            var subscribers = _this.topics[topic],
                len;

            if (subscribers.length) {
                len = subscribers.length;
            } else {
                return false;
            }

            while (len--) {
                subscribers[len].fn(data);
            }
        }, 0);
        return true;
    },
    
    /**
     * Listens for events triggered
     * @method nodedit.observer.subscribe
     * @param {string} name Identifier of the observer
     * @param {requestCallback} fn The function to fire when event triggered
     * @returns {number} A token assigned to the subscription
     */
    subscribe: function (topic, fn) {
        var _this = this,
            id = ++this.topic_id,
            max,
            i;
        
        // Create new topic
        if (!_this.topics[topic]) {
            _this.topics[topic] = [];
        }
        
        // Prevent re-subscribe issues (common on route-reload)
        for (i = 0, max = _this.topics[topic].length; i < max; i++) {
            if (_this.topics[topic][i].fn.toString() === fn.toString()) {
                return _this.topics[topic][i].id;
            }
        }
        
        _this.topics[topic].push({
            id: id,
            fn: fn
        });

        return id;
    },
    
    /**
     * Unsubscribes an observer
     * @method nodedit.observer.unsubscribe
     * @param {number} token Token of the subscription
     */
    unsubscribe: function (token) {
        var _this = this,
            topic,
            i,
            max;
        for (topic in _this.topics) {
            if (_this.topics.hasOwnProperty(topic)) {
                for (i = 0, max = _this.topics[topic].length; i < max; i++) {
                    if (_this.topics[topic][i].id === token) {
                        _this.topics[topic].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    },
    
};