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