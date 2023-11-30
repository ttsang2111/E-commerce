const { Client, GatewayIntentBits } = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log(`Logged is as ${client.user.tag}`);
})

client.on('messageCreate', msg => {
    if(msg.author.bot) return;
    if (msg.content === "hello") {
        msg.reply("Hi! How can I assist you today?")
    }
})

const token = "MTE3OTU5ODU0NDc2NDY4MjMzMA.G-gfF-.ThkEmn7B9msC12fy3xCUtQC8M1iVX-sWe3nfDU"
client.login(token)