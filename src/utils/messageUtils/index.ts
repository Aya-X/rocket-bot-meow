import { Message } from 'discord.js';

export async function sendWelcomeMessage(
  message: Message,
  groupName: string | null,
  batchName: string | null
) {
  const batch = batchName ? ` ${batchName}` : '';
  const group = groupName ? ` ${groupName}` : '';
  const username = message.author.globalName || message.author.username;

  console.log(`Group Name: ${group}, Batch Name: ${batch}, Username: ${username}`);
  await message.reply(
    `歡迎 ${batch} ${group} 的 ${username} 正式登陸本基地 🚀 ✧*｡٩(ˊᗜˋ*)و✧*｡`
  );
}
