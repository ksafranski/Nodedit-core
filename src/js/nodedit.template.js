/**
 * @method nodedit.template
 * 
 * Load the template
 * @param {string} tpl The template file to be loaded
 * @param {object} data (optional) Data to be loaded via Handlebars
 * @param {function} fn (optional) If passing in data, callback will return compiled template
 */
nodedit.template = function (tpl, data, fn) {
    
    return $.ajax({
        url: nodedit.templates+tpl,
        type: 'GET',
        success: function(tmpl){ 
            // Insert data
            if (data) {
                var template = Handlebars.compile(tmpl);
                tmpl = template({'data': data});
                fn(tmpl);
            }
        },
        error: function() {
            nodedit.message.error('Could not load template');
        }
    });

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