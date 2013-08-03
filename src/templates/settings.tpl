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
    
    <button id="btn-modal-close">Close</button>
    
</form>