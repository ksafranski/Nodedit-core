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
        <td><a class="icon-trash icon-large"></a></td>
    </tr>
    {{/each}}
    </tbody>
    </table>
    </div>
    
    <button class="btn-left">Save</button>
    <button class="btn-right" id="btn-modal-close">Close</button>
</form>