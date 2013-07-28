
<!-- bookmarks.tpl -->
<script id="bookmarks.tpl" type="text/x-handlebars-template">
<form>
    
    <div class="max-height-350">
    <table width="100%">
    <thead>
        <tr>
            <th width="5"></th>
            <th>Name</th>
            <th>Path</th>
            <th width="5"></th>
        </tr>
    </thead>
    <tbody>
    {{#each data}}
    <tr>
        <td><a class="icon-resize-vertical"></a></td>
        <td><input name="name" value="{{name}}"></td>
        <td><input name="path" value="{{path}}"></td>
        <td style="padding-top: 5px;"><a class="icon-trash icon-large"></a></td>
    </tr>
    {{/each}}
    </tbody>
    </table>
    </div>
    
    <button class="btn-left">Save</button>
    <button class="btn-right" onclick="nodedit.modal.close(); return false;">Close</button>
</form>
</script>

<!-- connect.tpl -->
<script id="connect.tpl" type="text/x-handlebars-template">
<form id="connect">
    
    <h1><span class="icon-cloud"></span>Connect To Server</h1>
    
    <label>Server:</label>
    <input name="url" placeholder="http://www.server.com">
    
    <label>Key:</label>
    <input name="key" placeholder="API Key">
    
    <button>Connect</button>
    
</form>
</script>

<!-- editor.tpl -->
<script id="editor.tpl" type="text/x-handlebars-template">
<div id="position"><span class="ln">Line 0</span><span class="ch">Char 0</span></div>
<ul id="tabs" class="top-bar"></ul>
<ul id="instances"></ul>
</script>

<!-- editor_change_mode.tpl -->
<script id="editor_change_mode.tpl" type="text/x-handlebars-template">
<form>
    <select name="mode">
        {{#eachkeys data.modes}}
        <option{{#if this.value}} selected="selected" {{/if}} value="{{this.key}}">{{this.key}}</option>
        {{/eachkeys}}
    </select>
    
    <button class="btn-left">Set Mode</button>
    <button class="btn-right" onclick="nodedit.modal.close(); return false;">Cancel</button>
</form>
</script>

<!-- editor_confirm_close.tpl -->
<script id="editor_confirm_close.tpl" type="text/x-handlebars-template">
<form>
    <div id="diffreg">
    </div>
    
    <button class="btn-left">Discard</button>
    <button class="btn-right" onclick="nodedit.modal.close(); return false;">Cancel</button>
</form>
</script>

<!-- editor_context_menu.tpl -->
<script id="editor_context_menu.tpl" type="text/x-handlebars-template">
<ul class="context-menu">
    {{modes}}
    <li><a id="save"><span class="icon-ok"></span> Save</a></li>
    <li><a id="close"><span class="icon-remove"></span> Close</a></li>
    <hr>
    <li><a id="mode"><span class="icon-code"></span> {{data.curmode}}</a></li>
    <hr>
    <li><a id="settings"><span class="icon-cogs"></span> Settings</a></li>
</ul>
</script>

<!-- filemanager.tpl -->
<script id="filemanager.tpl" type="text/x-handlebars-template">
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
</script>

<!-- filemanager_context_menu.tpl -->
<script id="filemanager_context_menu.tpl" type="text/x-handlebars-template">
<ul class="context-menu">
    {{#if data.dir}}
    <li><a id="new_file"><span class="icon-file-alt"></span> New File</a></li>
    <li><a id="new_directory"><span class="icon-folder-close-alt"></span> New Directory</a></li>
    <li><a id="bookmark"><span class="icon-star"></span> Bookmark</a></li>
    {{/if}}
    <li><a id="copy"><span class="icon-copy"></span> Copy</a></li>
    {{#if data.dir}}
        {{#if data.clipboard}}
        <li><a id="paste"><span class="icon-signout"></span> Paste</a></li>
        {{/if}}
    {{/if}}
    <li><a id="rename"><span class="icon-edit"></span> Rename</a></li>
    <li><a id="delete"><span class="icon-trash"></span> Delete</a></li>
</ul>
</script>

<!-- filemanager_create.tpl -->
<script id="filemanager_create.tpl" type="text/x-handlebars-template">
<form>
    <label>{{data.type}} Name:</label>
    <input type="text" name="name" placeholder="{{data.type}}_name">
    
    <button>Save</button>
</form>
</script>

<!-- filemanager_delete.tpl -->
<script id="filemanager_delete.tpl" type="text/x-handlebars-template">
<form>
    <div style="overflow: auto; margin: 0 0 15px 0;">
        {{data.path}}
    </div>
    
    <button>Confirm</button>
</form>
</script>

<!-- filemanager_dir.tpl -->
<script id="filemanager_dir.tpl" type="text/x-handlebars-template">
<ul>
{{#eachkeys data}}
    <li data-path="{{this.value.path}}"><a class="{{this.value.type}}"><span class="{{this.value.icon}}"></span>{{this.key}}</a></li>
{{/eachkeys}}
</ul>
</script>

<!-- filemanager_rename.tpl -->
<script id="filemanager_rename.tpl" type="text/x-handlebars-template">
<form>
    <label>New Name:</label>
    <input type="text" name="name" value="{{data.name}}">
    
    <button>Save</button>
</form>
</script>

<!-- modal.tpl -->
<script id="modal.tpl" type="text/x-handlebars-template">
<a class="icon-remove"></a>
<h2>{{data.title}}</h2>

<div id="modal-content"></div>
</script>

<!-- settings.tpl -->
<script id="settings.tpl" type="text/x-handlebars-template">
<form>
    
    <table>
        <tr>
            <td width="5">
                <label>Theme</label>    
            </td>
            <td>
                <select name="theme">
                    <option {{#ifCond data.theme '===' 'ambiance'}} selected="selected" {{/ifCond}} value="ambiance">Ambiance</option>
                    <option {{#ifCond data.theme '===' 'chaos'}} selected="selected" {{/ifCond}} value="chaos">Chaos</option>
                    <option {{#ifCond data.theme '===' 'chrome'}} selected="selected" {{/ifCond}} value="chrome">Chrome</option>
                    <option {{#ifCond data.theme '===' 'clouds'}} selected="selected" {{/ifCond}} value="clouds">Clouds</option>
                    <option {{#ifCond data.theme '===' 'clouds_midnight'}} selected="selected" {{/ifCond}} value="clouds_midnight">Clouds - Midnight</option>
                    <option {{#ifCond data.theme '===' 'cobalt'}} selected="selected" {{/ifCond}} value="cobalt">Cobalt</option>
                    <option {{#ifCond data.theme '===' 'crimson'}} selected="selected" {{/ifCond}} value="crimson">Crimson</option>
                    <option {{#ifCond data.theme '===' 'dawn'}} selected="selected" {{/ifCond}} value="dawn">Dawn</option>
                    <option {{#ifCond data.theme '===' 'dreamweaver'}} selected="selected" {{/ifCond}} value="dreamweaver">Dreamweaver</option>
                    <option {{#ifCond data.theme '===' 'eclipse'}} selected="selected" {{/ifCond}} value="eclipse">Eclipse</option>
                    <option {{#ifCond data.theme '===' 'github'}} selected="selected" {{/ifCond}} value="github">Github</option>
                    <option {{#ifCond data.theme '===' 'idle_fingers'}} selected="selected" {{/ifCond}} value="idle_fingers">Idle Fingers</option>
                    <option {{#ifCond data.theme '===' 'kr'}} selected="selected" {{/ifCond}} value="kr">KR</option>
                    <option {{#ifCond data.theme '===' 'merbivore'}} selected="selected" {{/ifCond}} value="merbivore">Merbivore</option>
                    <option {{#ifCond data.theme '===' 'merbivore_soft'}} selected="selected" {{/ifCond}} value="merbivore_soft">Merbivore Soft</option>
                    <option {{#ifCond data.theme '===' 'mono_industrial'}} selected="selected" {{/ifCond}} value="mono_industrial">Mono Industrial</option>
                    <option {{#ifCond data.theme '===' 'monokai'}} selected="selected" {{/ifCond}} value="monokai">Monokai</option>
                    <option {{#ifCond data.theme '===' 'pastel_on_dark'}} selected="selected" {{/ifCond}} value="pastel_on_dark">Pastel On Dark</option>
                    <option {{#ifCond data.theme '===' 'solarized_dark'}} selected="selected" {{/ifCond}} value="solarized_dark">Solarized Dark</option>
                    <option {{#ifCond data.theme '===' 'solarized_light'}} selected="selected" {{/ifCond}} value="solarized_light">Solarized Light</option>
                    <option {{#ifCond data.theme '===' 'terminal'}} selected="selected" {{/ifCond}} value="terminal">Terminal</option>
                    <option {{#ifCond data.theme '===' 'tomorrow'}} selected="selected" {{/ifCond}} value="tomorrow">Tomorrow</option>
                    <option {{#ifCond data.theme '===' 'tomorrow_night'}} selected="selected" {{/ifCond}} value="tomorrow_night">Tomorrow Night</option>
                    <option {{#ifCond data.theme '===' 'tomorrow_night_blue'}} selected="selected" {{/ifCond}} value="tomorrow_night_blue">Tomorrow Night Blue</option>
                    <option {{#ifCond data.theme '===' 'tomorrow_night_bright'}} selected="selected" {{/ifCond}} value="tomorrow_night_bright">Tomorrow Night Bright</option>
                    <option {{#ifCond data.theme '===' 'tomorrow_night_eighties'}} selected="selected" {{/ifCond}} value="tomorrow_night_eighties">Tomorrow Night Eighties</option>
                    <option {{#ifCond data.theme '===' 'twilight'}} selected="selected" {{/ifCond}} value="twilight">Twilight</option>
                    <option {{#ifCond data.theme '===' 'vibrant_ink'}} selected="selected" {{/ifCond}} value="vibrant_ink">Vibrant Ink</option>
                    <option {{#ifCond data.theme '===' 'xcode'}} selected="selected" {{/ifCond}} value="xcode">XCode</option>
                </select>
            </td>
        </tr>
        
        <tr>
            <td>
                <label>Font&nbsp;Size</label>
            </td>
            <td>
                <select name="fontsize">
                    <option {{#ifCond data.fontsize '==' '10'}} selected="selected" {{/ifCond}} value="10">10px</option>
                    <option {{#ifCond data.fontsize '==' '11'}} selected="selected" {{/ifCond}} value="11">11px</option>
                    <option {{#ifCond data.fontsize '==' '12'}} selected="selected" {{/ifCond}} value="12">12px</option>
                    <option {{#ifCond data.fontsize '==' '13'}} selected="selected" {{/ifCond}} value="13">13px</option>
                    <option {{#ifCond data.fontsize '==' '14'}} selected="selected" {{/ifCond}} value="14">14px</option>
                    <option {{#ifCond data.fontsize '==' '15'}} selected="selected" {{/ifCond}} value="15">15px</option>
                    <option {{#ifCond data.fontsize '==' '16'}} selected="selected" {{/ifCond}} value="16">16px</option>
                    <option {{#ifCond data.fontsize '==' '17'}} selected="selected" {{/ifCond}} value="17">17px</option>
                    <option {{#ifCond data.fontsize '==' '18'}} selected="selected" {{/ifCond}} value="18">18px</option>
                </select>
            </td>
        </tr>
    
        <tr>
            <td>
                <label>Show&nbsp;Print&nbsp;Margin</label>
            </td>
            <td>
                <select name="printmargin">
                    <option value="false">No</option>
                    <option {{#if data.printmargin}} selected="selected" {{/if}} value="true">Yes</option>
                </select>
            </td>
        </tr>
        
        <tr>
            <td>
                <label>Highlight&nbsp;Current&nbsp;Line</label>
            </td>
            <td>
                <select name="highlightline">
                    <option value="false">No</option>
                    <option {{#if data.highlightline}} selected="selected" {{/if}} value="true">Yes</option>
                </select>
            </td>
        </tr>
        
        <tr>
            <td>
                <label>Show&nbsp;Indent&nbsp;Guides</label>
            </td>
            <td>
                <select name="indentguides">
                    <option value="false">No</option>
                    <option {{#if data.indentguides}} selected="selected" {{/if}} value="true">Yes</option>
                </select>
            </td>
        </tr>
        
        <tr>
            <td>
                <label>Wrap Lines</label>
            </td>
            <td>
                <select name="wrapping">
                    <option value="false">No</option>
                    <option {{#if data.wrapping}} selected="selected" {{/if}} value="true">Yes</option>
                </select>
            </td>
        </tr>
        
    </table>
    
    <button onclick="nodedit.modal.close(); return false;">Close</button>
    
</form>
</script>

<!-- tab.tpl -->
<script id="tab.tpl" type="text/x-handlebars-template">
<li data-id="{{data.id}}" title="{{data.path}}">
    <a class="icon-remove"></a>
    <label>{{data.name}}</label>
</li>
</script>

<!-- workspace.tpl -->
<script id="workspace.tpl" type="text/x-handlebars-template">
<div id="filemanager"></div>
<div id="editor"></div>
</script>
