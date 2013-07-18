/**
 * Load the template
 * @method nodedit.template
 * @param {string} tpl The template file to be loaded
 * @param {object} [data] Data to be loaded via Handlebars
 * @param {requestCallback} [fn] If passing in data, callback will return compiled template
 */
nodedit.template = function (tpl, data, fn) {
    var template,
        defer,
        tmpl;
    
    // In src environment, load each template via xhr
    if (nodedit.env === 'src') {
    
        return $.ajax({
            url: nodedit.templates+tpl,
            type: 'GET',
            success: function (tmpl){ 
                // Insert data
                if (data) {
                    template = Handlebars.compile(tmpl);
                    tmpl = template({'data': data});
                    fn(tmpl);
                }
            },
            error: function (){
                nodedit.message.error('Could not load template');
            }
        });
    
    // In dist environment, templates loaded as single file into DOM, pulled from DOM when needed
    } else {

        // Return a Deferred after the promise has been completed.
        defer = new $.Deferred();
        
        // Setup template
        tmpl = $('script[id="' + tpl + '"]').html();
        template = Handlebars.compile(tmpl);
        tmpl = template({'data' : data });
        
        // Resolve the defer, pass in tmpl to call .done()
        defer.resolve(tmpl);
        
        // Check for callback if not using .done()
        if ( typeof fn === 'function' ) {
            fn(tmpl);
        }
        
        // Return promise to callee
        return defer.promise();
    }

};

// Handlebars helper for object key-value
Handlebars.registerHelper('eachkeys', function (context, options) {
    var fn = options.fn, inverse = options.inverse,
        ret = "",
        empty = true;
    
    for (key in context) { empty = false; break; }
    
    if (!empty) {
        for (key in context) {
            ret = ret + fn({ 'key': key, 'value': context[key]});
        }
    } else {
        ret = inverse(this);
    }
    return ret;
});

// Hanldebars helper for comparison operators
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
