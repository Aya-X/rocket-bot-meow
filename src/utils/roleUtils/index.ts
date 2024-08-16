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
  roleMap: Record<string, string>
): string | null {
  const messageWords = new Set(message.content.toLowerCase().split(/\s+/));
  const roleMapSet = new Map(
    Object.entries(roleMap).map(([key, value]) => [new Set(key.split(/\s+/)), value])
  );

  const matchedEntry = Array.from(roleMapSet.entries()).find(
    ([roleKeywords]) => hasMatchingKeywords(roleKeywords, messageWords)
  );
  if (!matchedEntry) {
    return null;
  }

  const [_, roleName] = matchedEntry;
  const role = findRole(message, roleName);
  if (!role) {
    return null
  };

  assignRole(message, role);
  return roleName;
}
// end of findAndAssignRole
