# Nodedit - Thin-Client IDE

**Nodedit is a web-based, thin-client IDE.**

Huh? To put it simply, you don't need a server or workspace, database, or anything else to run it. It can run in your browser without any requirements or installation.

So, how do I work with it? Simple - you connect Nodedit to a remote server running [NodeJS](http://nodejs.org/) and an instance of the [Nodedit-Server](https://github.com/Fluidbyte/Nodedit-Server). Just setup and run the remote server then when you open Nodedit just connect using the URL and API key.

Once connected the editor runs all interactions against the remote server.

## Demo

You can test out the [Nodedit Demo](http://demo.nodedit.com) which is the latest build. Keep in mind you will need a copy of `server.js` file from [Nodedit-Server](https://github.com/Fluidbyte/Nodedit-Server) running somewhere and the connection info and key in order to access the remote system.