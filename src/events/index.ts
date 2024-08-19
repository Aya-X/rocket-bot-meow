import { Message } from 'discord.js';

import { GROUP_MAP, CURRENT_BATCH } from '../constants';

import { findAndAssignRole } from '../utils/roleUtils';
import { sendWelcomeMessage } from '../utils/messageUtils';


const BATCH_MAP: Record<string, string[]> = Object.fromEntries(
  Array.from({ length: CURRENT_BATCH }, (_, i) => [`第 ${i + 1} 梯`, [`${i + 1}梯`, `第${i + 1}梯`]])
);
// end of BATCH_MAP

export async function handleMessage(message: Message) {
  console.log(`Received message::: ${message.content}`);
  if (
    message.author.bot ||
    message.channel.id !== process.env.TARGET_CHANNEL_ID
  ) {
    console.log('Message is from bot or not in target channel!');
    return;
  }

  const groupName = findAndAssignRole(message, GROUP_MAP);
  const batchName = findAndAssignRole(message, BATCH_MAP);

  if (groupName || batchName) {
    await sendWelcomeMessage(message, groupName, batchName);
  }
}
