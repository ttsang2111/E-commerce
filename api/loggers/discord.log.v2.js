'use strict';

const { Client, GatewayIntentBits } = require('discord.js');
const { CHANNELID_DISCORD, TOKEN_DISCORD } = process.env

class DiscordLoggerService {
    constructor() {
        console.log("DiscordLoggerService", CHANNELID_DISCORD, TOKEN_DISCORD)
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        // add channelId
        this.channelId = CHANNELID_DISCORD

        this.client.on('ready', () => {
            console.log(`Logged is as ${this.client.user.tag}`)
        })
        this.client.login(TOKEN_DISCORD)
    }

    sentToMessage( message='message') {
        const channel = this.client.channels.cache.get(this.channelId)
        if(!channel) {
            console.error(`Couldn't find the channel...`, this.channelId)
        }

        channel.send(message).catch(e => console.error(e))
    }

    sendToFormatCode(logData) {
        const { code, message="This is some additional information about the code", title="Code Example"} = logData;

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16), // Convert hexadecimal color to integer
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                },
            ],
        }
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) {
            console.error("Couldn't find the channel.", this.channelId);
            return;
        }
        channel.send(codeMessage).catch(e => console.log(e)); 
    }
}

const discordLoggerService = new DiscordLoggerService();
module.exports = discordLoggerService;