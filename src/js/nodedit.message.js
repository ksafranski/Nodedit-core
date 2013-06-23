/**
 * @object nodedit.message
 * 
 * Hanldes notifications and messaging
 */
nodedit.message = {
    
    /**
     * @method nodedit.message.show
     * 
     * Visibly displays the message
     * @param {string} msg The message
     * @param {string} type Error or success
     * 
     */
    show: function (msg, type) {
        
        var icon,
            block,
            blockHeight;
        
        // Remove any existing messages
        $('#message').remove();
        
        (type==='success') ? icon = 'icon-thumbs-up' : icon = 'icon-thumbs-down'; 
        
        // Create new instance
        $('body').append('<div id="message" class="'+type+'"><span class="'+icon+'"></span>&nbsp;'+msg+'</div>');
        block = $('#message');
        blockHeight = block.outerHeight();
        
        // Slide up and fade in
        block
            // Set start
            .css({'bottom':'-'+blockHeight+'px', 'opacity': '0'})
            .animate({'bottom':'0', 'opacity': '1'}, 500)
            
            // Wait 3 seconds
            .delay(3000)
            
            // Slide down and fade out
            .animate({'bottom':'-'+blockHeight+'px', 'opacity': '0'}, { 'complete': function () {
                $(this).remove();
            }}, 500)
        
    },
    
    /**
     * @method nodedit.message.error
     * 
     * Shows error message
     * @param {string} msg Message to display
     */
    error: function (msg) {
        nodedit.message.show(msg, 'error');
    },
    
    /**
     * @method nodedit.message.success
     * 
     * Shows success message
     * @param {string} msg Message to display
     */
    success: function (msg) {
        nodedit.message.show(msg, 'success');
    }
}