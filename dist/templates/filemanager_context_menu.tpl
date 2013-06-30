<ul class="context-menu">
    {{#if data.dir}}
    <li><a id="new_file"><span class="icon-file-alt"></span> New File</a></li>
    <li><a id="new_directory"><span class="icon-folder-close-alt"></span> New Directory</a></li>
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