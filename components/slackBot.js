const { RtmClient, CLIENT_EVENTS, RTM_EVENTS, WebClient } = require('@slack/client');
const config = require("./config.json");

 
// An access token (from your Slack app or custom integration - usually xoxb)
const token = config.slackToken;
 
// Cache of data
const appData = {};
 
// Initialize the RTM client with the recommended settings. Using the defaults for these
// settings is deprecated.
const rtm = new RtmClient(token, {
  dataStore: false,
  useRtmConnect: true,
});
 
// The client will emit an RTM.AUTHENTICATED event on when the connection data is avaiable
// (before the connection is open)
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (connectData) => {
  // Cache the data necessary for this app in memory
  appData.selfId = connectData.self.id;
  console.log(`Logged in as ${appData.selfId} of team ${connectData.team.id}`);
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    let msgFinder = message.channel.charAt(0);
    console.log(msgFinder);
    const args = message.text.slice(config.prefix.length).trim().split(/ +/g);
    //assigns user address to arg1
    const command = args.shift().toLowerCase();

    console.log(`New Message: 
    User: ${message.user}
    Channel: ${message.channel}
    Text: ${message.text}
    args: ${args}
    command: ${command}`);
    if (!message.text.startsWith(config.prefix) || message.user !== config.slackOwnerID) { 
        console.log(`No Prefix Detected..`);
        return;
    }

    else if (command === 'address' && (!args[0])) {
        console.log(`No Address Found.. Sending Reply`);
        rtm.sendMessage(`Try This: !address YourECAaddress`, message.channel);
    }



    else if (command === 'pay' && message.user !== config.slackOwnerID) {
        rtm.sendMessage(`I do not think you are the owner...`, message.channel);
        return;
    }

    else if (command === 'pay' && message.user === config.slackOwnerID) {
        let payTo = args[0].slice(2, -1);
        let amtArg = parseFloat(args[1]);
        let amtStr = amtArg.toFixed(4);
        let amt = Number(amtStr);
    console.log(`Pay To: ${payTo} Amount: ${amt}`)
    rtm.sendMessage(`You Paid ${payTo1} Amount: ${amt}`, message.channel)
    } 

});

// The client will emit an RTM.RTM_CONNECTION_OPEN the connection is ready for
// sending and recieving messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPEN, () => {
  console.log(Ready);
});
 
// Start the connecting process
rtm.start(token);   