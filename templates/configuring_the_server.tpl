<h2>Configuring the Server</h2>

<p>The Nodedit system is client-server. The server is a crucial part - providing an API to which the client can connect. There are several steps 
    involved in configuring a server instance.
</p>

<h3>1. Get the Server and Dependencies</h3>

<p>A core requirement for the server is <a href="http://www.nodejs.org" target="_blank">NodeJS</a>. Ensure this is installed and working properly before 
    proceeding.
</p>

<p>Installing the server can be done with Git by simply cloning the source:</p>

<pre><code>git clone https://github.com/Fluidbyte/Nodedit-Server.git</code></pre>

<p>Once the server is present dependencies can be installed via the <code>packages.json</code> file using:</p>

<pre><code>npm install</code></pre>

<p>It is also suggested you install <code>node-forever</code> by using <code>npm install forever -g</code> which will allow 
    you to run the server continuously.
</p>

<h3>2. Configure the Server</h3>

<p>The <code>server.js</code> file contains a <code>config</code> object which can be used to set the configuration of the server.</p>

<p>The primary things to setup are following:</p>

<p>
    <ul>
        <li><code>keys</code> which is an array or API keys available (alphanumeric)</li>
        <li><code>port</code> which is the port which the server will run on</li>
        <li><code>base</code> which is the (relative) path to the folder where you will house your files (no leading or trailing slash)</li>
    </ul>
</p>

<h3>3. Run the Server</h3>

<p>You can run the server by simply running <code>node server.js</code></p>

<p>If you have <code>node-forever</code> installed you can run the server via <code>forever server.js</code>.</p>