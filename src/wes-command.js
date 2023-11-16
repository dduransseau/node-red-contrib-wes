module.exports = function(RED) {

	const WesClient = require('./wes-client.js');
	
	function WesCommandRequest(config) {
        RED.nodes.createNode(this, config);
		
		this.server = RED.nodes.getNode(config.server);

        // Store the node instance for later use
        const node = this;
		var command = "";

        // Handle incoming messages
        this.on('input', async function(msg, send, done) {
			command = msg.payload;
			const client = new WesClient(this.server);
			const result = await client.sendCommand(command);
			node.trace("Received result: "+result)
			msg.payload = result
			send(msg);
			done();	
        });
    }
	RED.nodes.registerType("wes-command", WesCommandRequest);
}
