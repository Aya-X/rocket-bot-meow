import { Message } from 'discord.js';

import { CURRENT_BATCH, GROUP_MAP, FINISH_MAP, ALUMNI_MAP } from '../constants';

import { findAndAssignRole } from '../utils/roleUtils';
import { sendWelcomeMessage } from '../utils/messageUtils';

export const MSG_TYPES = ['NEW', 'CHEERS', 'BONUS'] as const;
export type MessageType = typeof MSG_TYPES[number];

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

  const messageTypeHandlers: Record<string, (message: Message) => {
    type: MessageType;
    title: string;
  } | null> = {
    BONUS: (message) => {
      const alumniName = findAndAssignRole(message, ALUMNI_MAP) ?? '';

      return alumniName ? { type: 'BONUS', title: alumniName } : null;
    },
    CHEERS: (message) => {
      const finishName = findAndAssignRole(message, FINISH_MAP) ?? '';
      const batchName = findAndAssignRole(message, BATCH_MAP) ?? '';
      const title = `${batchName} ${finishName}`;

      return batchName && finishName ? { type: 'CHEERS', title } : null;
    },
    NEW: (message) => {
      const batchName = findAndAssignRole(message, BATCH_MAP) ?? '';
      const groupName = findAndAssignRole(message, GROUP_MAP) ?? '';
      const title = batchName ? `${batchName} ${groupName}` : groupName;

      return groupName ? { type: 'NEW', title } : null;
    },
  };
  // end of messageTypeHandlers

  const extractedRoleInfo = MSG_TYPES.map(key => {
    return messageTypeHandlers[key]?.(message);
  })
    .find(info => {
      return info !== null;
    });
  // end of extractedRoleInfo

  if (extractedRoleInfo) {
    await sendWelcomeMessage(extractedRoleInfo.type, message, extractedRoleInfo.title);
  }
}
