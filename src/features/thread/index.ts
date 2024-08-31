import { Message, ThreadChannel } from 'discord.js';

import { sendAnnouncementMessages } from '@/utils/messageUtils';

export async function threadHandler(message: Message) {
  const thread = message.channel as ThreadChannel;

  const isReplyInExistingThread = thread.createdTimestamp !== message.createdTimestamp;
  if (isReplyInExistingThread) {
    console.log('Message is a reply in an existing forum thread');
    return;
  }
  console.log('New forum post created!');

  const postTitle = thread.name || "New Post";
  const postContent = message.content;
  const postLink = `https://discord.com/channels/${message.guild?.id}/${thread.id}/${message.id}`;

  await sendAnnouncementMessages(message, postTitle, postContent, postLink);
}