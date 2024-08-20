import { Message } from 'discord.js';

import {
  CURRENT_BATCH,
  GROUP_MAP,
  FINISH_MAP,
  ALUMNI_MAP,
  REMOVED_MAP,
} from '../constants';

import {
  assignRoleToSameBatchMembers,
  findAndAssignRole,
  findRoleNameFromMap,
  removeOneMemberRoles,
  removeBatchMembersRoles,
} from '../utils/roleUtils';
import { sendWelcomeMessage } from '../utils/messageUtils';

export const MSG_TYPES = ['NEW', 'CHEERS', 'BONUS'] as const;
export type MessageType = (typeof MSG_TYPES)[number];

const BATCH_MAP: Record<string, string[]> = Object.fromEntries(
  Array.from({ length: CURRENT_BATCH }, (_, i) => [
    `第 ${i + 1} 梯`,
    [`${i + 1}梯`, `第${i + 1}梯`],
  ])
);
// end of BATCH_MAP

const messageTypeHandlers: Record<
  string,
  (message: Message) => Promise<{
    type: MessageType;
    title: string;
  } | null>
> = {
  BONUS: async (message) => {
    const alumniName = findAndAssignRole(message, ALUMNI_MAP) ?? '';

    return alumniName ? { type: 'BONUS', title: alumniName } : null;
  },
  CHEERS: async (message) => {
    const batchName = findRoleNameFromMap(message, BATCH_MAP) ?? '';
    const finishName = findRoleNameFromMap(message, FINISH_MAP) ?? '';
    const title = `${batchName} ${finishName}`;

    if (!batchName || !finishName) {
      return null;
    }

    await removeBatchMembersRoles(message, batchName, REMOVED_MAP['JUNIOR']);
    await assignRoleToSameBatchMembers(message, batchName, finishName);

    return { type: 'CHEERS', title };
  },
  NEW: async (message) => {
    const batchName = findAndAssignRole(message, BATCH_MAP) ?? '';
    const groupName = findAndAssignRole(message, GROUP_MAP) ?? '';
    const title = batchName ? `${batchName} ${groupName}` : groupName;

    if (message.member) {
      await removeOneMemberRoles(message.member, REMOVED_MAP['NEWBIE']);
    }

    return groupName ? { type: 'NEW', title } : null;
  },
};
// end of messageTypeHandlers

export async function handleMessage(message: Message) {
  console.log(`Received message::: ${message.content}`);
  if (
    message.author.bot ||
    message.channel.id !== process.env.TARGET_CHANNEL_ID
  ) {
    console.log('Message is from bot or not in target channel!');
    return;
  }

  const extractedRoleInfo = await Promise.all(
    MSG_TYPES.map((key) => {
      return messageTypeHandlers[key]?.(message);
    })
  )
    .then((infos) => infos.find((info) => info !== null))
    .catch((err) => console.log('Error processing message types:', err));
  // end of extractedRoleInfo

  if (extractedRoleInfo) {
    await sendWelcomeMessage(
      extractedRoleInfo.type,
      message,
      extractedRoleInfo.title
    );
  }
}
