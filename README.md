# Nodedit - Thin-Client IDE

**Nodedit is a web-based, thin-client IDE.**

Nodedit is a thin-client IDE that runs completely in the browser. To work with files you connect to an instance of the [Nodedit-Server](https://github.com/Fluidbyte/Nodedit-Server) which controls I/O with the remote filesystem. Simply provide the URL (and port) as well as an API key and that's it.

## Running Nodedit

As mentioned above, ensure that you have an instance of [Nodedit-Server](https://github.com/Fluidbyte/Nodedit-Server) running on a server.

Once you have a server to connect to just open the client. You can run it locally or serve it from a webserver, it has no rquirements except a modern web browser.

You can also access an instance with the latest build at [Noded.it](http://noded.it).

## License & Usage

Both the Nodedit Client and Server are released under the MIT-style open source license and are free to use, modify, break, tweak, etc to your hearts content. All that is asked is you mention your use of the code somewhere.

## Contributing

The system is still very new. While there has been extensive testing and building of stuff to prevent any data-breaking there still are a myriad of things that can be tested, improved upon, added to, and so on and so forth.

If you'd like to contribute please follow these steps:

1. Create an issue. Select an appropriate label from the list and describe what you've found, intend to change, add, etc...
2. Fork and create a branch. Won't get to picky here, but good branching results in easier (and faster) pulls
3. Follow code conventions. They're pretty obvious. Also, comment your code. No comments === No pull.
4. Make good commits. Don't just put "fixed it", if we need to revert or just follow the path of changes to identify an issue we want some details
5. Submit a pull request. Please don't just submit something crappy. Give a title, some moderately in-depth description and maybe some testing criteria.

Good open-source (and code in general) is well organized. Taking a little extra time to ensure your code is understandable goes a long way in keeping things in order and growing a solid application instead of a monolithic beast.