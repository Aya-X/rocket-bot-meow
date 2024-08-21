import { Message } from 'discord.js';

import { roleHandler } from '@/features/role';

export async function handleMessage(message: Message) {
  console.log(`Received message::: ${message.content}`);
  if (message.author.bot) {
    console.log('Message is from bot!');
    return;
  }

  if (message.channel.id === process.env.ROLE_CHANNEL_ID) {
    await roleHandler(message);
  }
}
