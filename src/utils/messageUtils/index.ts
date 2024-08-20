import { Message } from 'discord.js';

import { MessageType } from '../../events';

const welcomeMessages: Record<
  string,
  (title: string, username?: string) => string
> = {
  BONUS: (title, username) =>
    `Hi, ${title} ${username}，讓我們共同探索這個世界 (๑˃̵ᴗ˂̵)و`,
  CHEERS: (title) => `恭喜 ${title} 畢業啦 🎉 ✧*｡٩(ˊᗜˋ*)و✧*｡`,
  NEW: (title, username) =>
    `歡迎 ${title} ${username} 正式登陸本基地 🚀 (๑•̀ㅂ•́)و✧`,
};
// end of welcomeMessages

export async function sendWelcomeMessage(
  type: MessageType,
  message: Message,
  title: string
) {
  const username = message.author.globalName || message.author.username;

  const replyMessage = welcomeMessages[type](title, username);

  await message.reply(replyMessage);
}
