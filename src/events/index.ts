import { Message } from 'discord.js';

import { roleHandler } from '@/features/role';
import { threadHandler } from '@/features/thread';

export async function handleMessage(message: Message) {
  console.log(`Received message::: ${message.content}`);
  if (message.author.bot) {
    console.log('Message is from bot!');
    return;
  }

  const isRoleChannel = message.channel.id === process.env.ROLE_CHANNEL_ID;
  const isForumThread = message.channel.isThread() && message.channel.parent?.id === process.env.FORUM_CHANNEL_ID;

  if (isRoleChannel) {
    await roleHandler(message);
  }

  if (isForumThread) {
    await threadHandler(message);
  }
}
