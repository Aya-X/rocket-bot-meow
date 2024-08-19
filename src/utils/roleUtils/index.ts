import { Message, Role } from 'discord.js';

function hasMatchingKeywords(roleKeywords: Set<string>, messageWords: Set<string>): boolean {
  return Array.from(roleKeywords).some(keyword => messageWords.has(keyword));
}
// end of hasMatchingKeywords

function findRole(message: Message, roleName: string): Role | undefined {
  return message.guild?.roles.cache.find((role) => role.name === roleName);
}
// end of findRole

async function assignRole(message: Message, role: Role) {
  console.log(`Added role ${role.name} to user ${message.author.tag}`);

  await message.member?.roles.add(role);
}
// end of assignRole

export function findAndAssignRole(
  message: Message,
  roleMap: Record<string, string[]>,
): string | null {
  const messageContent = message.content.toLowerCase().replace(/\s+/g, '');
  const roleMapSet = new Map(
    Object.entries(roleMap).map(([roleName, keywords]) => [new Set(keywords), roleName])
  );

  const matchedEntry = Array.from(roleMapSet.entries()).find(([keywords]) => {
    return hasMatchingKeywords(keywords, new Set([messageContent]));
  });

  if (!matchedEntry) {
    console.log('No matching role found!');
    return null;
  }

  const [_, roleName] = matchedEntry;
  const role = findRole(message, roleName);

  if (!role) {
    console.log(`Role ${roleName} not found!`);
    return null;
  }

  assignRole(message, role);
  return roleName;
}
// end of findAndAssignRole
