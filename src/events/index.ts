import { Message, ThreadChannel } from 'discord.js';

import { roleHandler } from '@/features/role';
import { threadHandler } from '@/features/thread';

export async function handleMessage(message: Message) {
  console.log(`Received message::: ${message.content}`);
  if (message.author.bot) {
    console.log('Message is from bot!');
    return;
  }

  if (message.channel.id === process.env.ROLE_CHANNEL_ID) {
    await roleHandler(message);
  }

  if (message.channel.isThread() && message.channel.parent?.id === process.env.FORUM_CHANNEL_ID) {
    await threadHandler(message);
  }

}
