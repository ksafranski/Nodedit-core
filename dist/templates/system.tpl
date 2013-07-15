
<!-- {{tplbasename}} -->
<div data-tpl="{{tplbasename}}">

<!-- bookmarks.tpl -->
<div data-tpl="bookmarks.tpl">
<form>
    
    <div class="max-height-350">
    <table width="100%">
    <tr>
        <th>Name</th>
        <th>Path</th>
        <th width="5"></th>
    </tr>
    {{#each data}}
    <tr>
        <td><input name="name" value="{{name}}"></td>
        <td><input name="path" value="{{path}}"></td>
        <td style="padding-top: 5px;"><a class="icon-trash icon-large"></a></td>
    </tr>
    {{/each}}
    </table>
    </div>
    
    <button class="btn-left">Save</button>
    <button class="btn-right" onclick="nodedit.modal.close(); return false;">Close</button>
</form>
</div>

<!-- connect.tpl -->
<div data-tpl="connect.tpl">
<form id="connect">
    
    <h1><span class="icon-cloud"></span>Connect To Server</h1>
    
    <label>Server:</label>
    <input name="url" placeholder="http://www.server.com">
    
    <label>Key:</label>
    <input name="key" placeholder="API Key">
    
    <button>Connect</button>
    
</form>
</div>

<!-- editor.tpl -->
<div data-tpl="editor.tpl">
<ul id="tabs" class="top-bar"></ul>
<ul id="instances"></ul>
</div>

<!-- editor_confirm_close.tpl -->
<div data-tpl="editor_confirm_close.tpl">
<form>
    <div id="diffreg">
    </div>
    
    <button class="btn-left">Discard</button>
    <button class="btn-right" onclick="nodedit.modal.close(); return false;">Cancel</button>
</form>
</div>

<!-- filemanager.tpl -->
<div data-tpl="filemanager.tpl">
<div id="resize-handle" class="ui-resizable-handle ui-resizable-e ui-resizable-w" style="float: right">||</div>

<div class="top-bar">

    <a id="disconnect" title="Close Session" class="icon-power-off"></a>
    
    <a id="bookmarks" title="Bookmarks" class="icon-star"></a>
    
    <a id="settings" title="Settings" class="icon-cogs"></a>
    
</div>
<div id="fm-container">
<ul>
   <li id="root" data-path="{{data.root}}"><a class="directory"><span class="icon-{{#if data.bookmark}}star{{else}}cloud{{/if}}"></span>{{data.root_name}}</a></li> 
</ul>
</div>
</div>

<!-- filemanager_context_menu.tpl -->
<div data-tpl="filemanager_context_menu.tpl">
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
</div>

<!-- filemanager_create.tpl -->
<div data-tpl="filemanager_create.tpl">
<form>
    <label>{{data.type}} Name:</label>
    <input type="text" name="name" placeholder="{{data.type}}_name">
    
    <button>Save</button>
</form>
</div>

<!-- filemanager_delete.tpl -->
<div data-tpl="filemanager_delete.tpl">
<form>
    <div style="overflow: auto; margin: 0 0 15px 0;">
        {{data.path}}
    </div>
    
    <button>Confirm</button>
</form>
</div>

<!-- filemanager_dir.tpl -->
<div data-tpl="filemanager_dir.tpl">
<ul>
{{#eachkeys data}}
    <li data-path="{{this.value.path}}"><a class="{{this.value.type}}"><span class="{{this.value.icon}}"></span>{{this.key}}</a></li>
{{/eachkeys}}
</ul>
</div>

<!-- filemanager_rename.tpl -->
<div data-tpl="filemanager_rename.tpl">
<form>
    <label>New Name:</label>
    <input type="text" name="name" value="{{data.name}}">
    
    <button>Save</button>
</form>
</div>

<!-- modal.tpl -->
<div data-tpl="modal.tpl">
<a class="icon-remove"></a>
<h2>{{data.title}}</h2>

<div id="modal-content"></div>
</div>

<!-- settings.tpl -->
<div data-tpl="settings.tpl">
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
        
    </table>
    
    <button onclick="nodedit.modal.close(); return false;">Close</button>
    
</form>
</div>

<!-- tab.tpl -->
<div data-tpl="tab.tpl">
<li data-id="{{data.id}}" title="{{data.path}}">
    <a class="icon-remove"></a>
    <label>{{data.name}}</label>
</li>
</div>

<!-- workspace.tpl -->
<div data-tpl="workspace.tpl">
<div id="filemanager"></div>
<div id="editor"></div>
</div>

</div>
