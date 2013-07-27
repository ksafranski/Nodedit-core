<form>
    <select name="mode">
        {{#eachkeys data.modes}}
        <option{{#if this.value}} selected="selected" {{/if}} value="{{this.key}}">{{this.key}}</option>
        {{/eachkeys}}
    </select>
    
    <button class="btn-left">Set Mode</button>
    <button class="btn-right" onclick="nodedit.modal.close(); return false;">Cancel</button>
</form>