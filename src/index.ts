import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

import { handleMessage } from './events';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', handleMessage);

client.login(process.env.DISCORD_TOKEN);
