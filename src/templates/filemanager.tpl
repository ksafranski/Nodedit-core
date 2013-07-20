<div id="resize-handle" class="ui-resizable-handle ui-resizable-e ui-resizable-w" style="float: right">||</div>

<div class="top-bar">

    <a id="disconnect" title="Close Session" class="icon-power-off"></a>
    
    <a id="bookmarks" title="Bookmarks" class="icon-star"></a>
    
    <a id="plugins" title="Plugins" class="icon-puzzle-piece"></a>
    
    <a id="settings" title="Settings" class="icon-cogs"></a>
    
</div>
<div id="fm-container">
<ul>
   <li id="root" data-path="{{data.root}}"><a class="directory"><span class="icon-{{#if data.bookmark}}star{{else}}cloud{{/if}}"></span>{{data.root_name}}</a></li> 
</ul>
</div>