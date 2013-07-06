# Nodedit - Thin-Client IDE

**Nodedit is a web-based, thin-client IDE.**

Huh? To put it simply, you don't need a server or workspace, database, or anything else to run it. It can run in your browser without any requirements or installation.

So, how do I work with it? Simple - you connect Nodedit to a remote server running [NodeJS](http://nodejs.org/) and an instance of the Filesystem API [Node-FSAPI](https://github.com/Fluidbyte/Node-FSAPI). Just setup and run the remote server then when you open Nodedit just connect using the URL and API key.

Once connected the editor runs all interactions against the remote server.

## Demo

You can test out the [Nodedit Demo](http://demo.nodedit.com) which is the latest build. Keep in mind you will need a copy of `server.js` file from [Node-FSAPI](https://github.com/Fluidbyte/Node-FSAPI) running somewhere and the connection info and key in order to access the remote system.

## Very, Very Alpha...

Please note, while *most* of the core features work, this is in no way to be seen as stable. I've tested each feature extensivley but I can't guaruntee data stability.