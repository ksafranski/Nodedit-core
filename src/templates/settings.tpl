<form>
    
    <label>Theme</label>
    <select name="theme">
        
    </select>
    
    <label>Font Size</label>
    <select name="fontsize">
        <option value="10">10px</option>
        <option value="11">11px</option>
        <option value="12">12px</option>
        <option value="13">13px</option>
        <option value="14">14px</option>
        <option value="15">15px</option>
        <option value="16">16px</option>
        <option value="17">17px</option>
        <option value="18">18px</option>
    </select>
    
    <label>Show Print Margin</label>
    <select name="printmargin">
        <option value="false">No</option>
        <option value="true">Yes</option>
    </select>
    
    <label>Highlight Current Line</label>
    <select name="highlightline">
        <option value="false">No</option>
        <option value="true">Yes</option>
    </select>
    
    <label>Show Indent Guides</label>
    <select name="indentguides">
        <option value="false">No</option>
        <option value="true">Yes</option>
    </select>
    
    <button class="btn-left">Save</button>
    <button class="btn-right" onclick="nodedit.modal.close(); return false;">Close</button>
    
</form>