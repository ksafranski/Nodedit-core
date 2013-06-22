nodedit.connect = {
    
    view: function() {
        $.get(nodedit.templates+'connect.tpl', function (tpl) {
            // Load template
            nodedit.$el.html(tpl);
            // Bind submission
            $('form#connect').on('submit', function (e) {
                e.preventDefault();
                nodedit.connect.process($(this).serializeArray());
            });
        });
    },
    
    process: function (formData) {
        console.log(formData);
    }
};