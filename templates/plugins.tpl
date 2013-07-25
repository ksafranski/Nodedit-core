<h2>Plugins</h2>

<p>Plugins allow you to easily add features and functionality to Nodedit.</p>

<h3>Plugins List</h3>

<p>Given the relative newness of the application, plugins are limited at this point, though we are actively working on more.</p>

<p>
    <ul>
        <li><a href="https://github.com/Fluidbyte/Nodedit-Plugin-JSLint" target="_blank">JSLint - Configure &amp; Run JSLint on Files in the Editor</a></li>
    </ul>
</p>

<h3>Installing Plugins</h3>

<p>To install a plugin simply download it and place it's folder in the <code>/plugins</code> directory. 
    You'll want to make sure the name of the plugin is the same as the name of the folder. From there you just 
    open the <code>/plugins/plugins.json</code> file and add the plugin into the object:
</p>

<p><pre><code>{
    "Plugin1 Title": "plugin1_folder",
    "Plugin2 Title": "plugin2_folder",
    ...
}
</code></pre></p>

<p>You'll need to refresh the application for the plugin to properly initialize.</p>

<h3>Building Plugins</h3>

<p>If you would like to contribute a plugin please see the <a href="https://github.com/Fluidbyte/Nodedit-Plugin-Template" target="_blank">Nodedit Plugin Template</a> 
    as it describes the requirements and procedure for developing plugins.
</p>

<p>Please make sure you've read up on <a href="#!/contributing">contributing to Nodedit</a> as well.</p>