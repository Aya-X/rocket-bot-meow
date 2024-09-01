import { Message, TextChannel } from 'discord.js';
import { sendWelcomeMessage, sendAnnouncementMessages } from '@/utils/messageUtils';
import { MessageType } from '@/features/role';

const createMockMessage = (username: string) => ({
  author: {
    globalName: username,
    username: username,
  },
  reply: jest.fn(),
} as unknown as Message);

const createMockChannel = (isTextBased: boolean) => ({
  isTextBased: jest.fn().mockReturnValue(isTextBased),
  send: jest.fn(),
} as unknown as TextChannel);

const createMockMessageWithChannel = (channelFound: boolean, mockChannel: Partial<TextChannel>) => ({
  guild: {
    channels: {
      cache: {
        get: jest.fn().mockReturnValue(channelFound ? mockChannel : null),
      },
    },
  },
} as unknown as Message);
// end of handler

describe('sendWelcomeMessage', () => {
  const testCases: { type: MessageType; expectedMessage: string }[] = [
    { type: 'NEW', expectedMessage: '歡迎 Test Title TestUser 正式登陸本基地 🚀 (๑•̀ㅂ•́)و✧' },
    { type: 'CHEERS', expectedMessage: '恭喜 Test Title 畢業啦 🎉 ✧*｡٩(ˊᗜˋ*)و✧*｡' },
    { type: 'BONUS', expectedMessage: 'Hi, Test Title TestUser，讓我們共同探索這個世界 (๑˃̵ᴗ˂̵)و' },
  ];

  testCases.forEach(({ type, expectedMessage }) => {
    it(`should send a welcome message for ${type} type`, async () => {
      const mockMessage = createMockMessage('TestUser');
      await sendWelcomeMessage(type, mockMessage as Message, 'Test Title');

      expect(mockMessage.reply).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
// end of sendWelcomeMessage

describe('sendAnnouncementMessages', () => {
  const setupTest = (isTextBased: boolean = true, channelFound: boolean = true) => {
    const mockChannel = createMockChannel(isTextBased);
    const mockMessage = createMockMessageWithChannel(channelFound, mockChannel);
    process.env.BROADCAST_CHANNEL_ID = 'testChannelId';

    return { mockMessage, mockChannel };
  };

  it('should send an announcement message to the specified channel', async () => {
    const { mockMessage, mockChannel } = setupTest();
    const title = 'New Article';
    const content = 'This is a new article content';
    const link = 'https://example.com/article';

    await sendAnnouncementMessages(mockMessage as Message, title, content, link);

    expect(mockMessage.guild?.channels.cache.get).toHaveBeenCalledWith('testChannelId');
    expect(mockChannel.send).toHaveBeenCalledWith(
      `論壇有新的文章出現囉::: **${title}**\n\n${content}\n[View Post](${link})`
    );
  });

  it('should not send a message if the channel is not text-based', async () => {
    const { mockMessage, mockChannel } = setupTest(false);
    await sendAnnouncementMessages(mockMessage as Message, 'Title', 'Content', 'https://example.com');

    expect(mockChannel.send).not.toHaveBeenCalled();
  });

  it('should not send a message if the channel is not found', async () => {
    const { mockMessage, mockChannel } = setupTest(true, false);
    await sendAnnouncementMessages(mockMessage as Message, 'Title', 'Content', 'https://example.com');

    expect(mockChannel.send).not.toHaveBeenCalled();
  });
});
// end of sendAnnouncementMessages

