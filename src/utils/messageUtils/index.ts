import { Message } from 'discord.js';

import { MessageType } from '@/features/role';

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
// end of sendWelcomeMessage

export async function sendAnnouncementMessages(
  message: Message,
  title: string,
  content: string,
  link: string
) {
  const announcementChannel = message.guild?.channels.cache.get(
    process.env.BROADCAST_CHANNEL_ID ?? ''
  );

  if (announcementChannel?.isTextBased()) {
    await announcementChannel.send(
      `論壇有新的文章出現囉::: **${title}**\n\n${content}\n[View Post](${link})`
    );
  }
}
// end of sendAnnouncementMessages
