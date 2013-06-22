nodedit.init = function () {
    
    nodedit.$el = $(nodedit.el);
    
    if (nodedit.session()) {
        
    } else {
        nodedit.connect.view();
    }
    
};

$(function(){
   
   nodedit.init();
   
});