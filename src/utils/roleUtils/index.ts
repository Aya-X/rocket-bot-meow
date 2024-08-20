import { Message, Role, GuildMember } from 'discord.js';

function hasMatchingKeywords(roleKeywords: string[], messageContent: string): boolean {
  return Array.from(roleKeywords).some(keyword => messageContent.includes(keyword));
}
// end of hasMatchingKeywords

async function assignRole(message: Message, role: Role) {
  console.log(`Added role ${role.name} to user ${message.author.tag}`);

  await message.member?.roles.add(role);
}
// end of assignRole

export function assignRoleToMembers(members: GuildMember[], finishRole: Role) {
  const assignPromises = members.map(async member => {
    console.log(`Assigning role ${finishRole.name} to user ${member.user.tag}`);
    try {
      return await member.roles.add(finishRole);
    } catch (err) {
      return console.log(`Failed to assign role ${finishRole.name} to ${member.user.tag}:`, err);
    }
  });
  // end of assignPromises

  return Promise.all(assignPromises);
}
// end of assignRoleToMembers

export async function assignRoleToSameBatchMembers(message: Message, batchName: string, finishName: string) {
  const role = findRole(message, batchName);
  if (!role) {
    console.log(`Role ${batchName} not found.`);
    return null;
  };

  const finishRole = findRole(message, finishName);
  if (!finishRole) {
    console.log(`Role ${finishName} not found.`);
    return null;
  }

  const membersWithRole = message.guild?.members.cache.filter(member => member.roles.cache.has(role.id));
  if (!membersWithRole) {
    console.log(`No members found with role ${batchName}`);
    return null;
  }

  const membersWithRoleArray = Array.from(membersWithRole.values());
  await assignRoleToMembers(membersWithRoleArray, finishRole);
}

export function findRole(message: Message, roleName: string): Role | undefined {
  return message.guild?.roles.cache.find((role) => role.name === roleName);
}
// end of findRole

export function findRoleNameFromMap(message: Message, roleMap: Record<string, string[]>): string | null {
  const messageContent = message.content.toLowerCase().replace(/\s+/g, '');

  const matchedEntry = Object.entries(roleMap).find(([roleName, keywords]) => {
    return hasMatchingKeywords(keywords, messageContent);
  });

  return matchedEntry ? matchedEntry[0] : null;
}
// end of findRoleNameFromMap

export function findAndAssignRole(
  message: Message,
  roleMap: Record<string, string[]>,
): string | null {
  const roleName = findRoleNameFromMap(message, roleMap);
  if (!roleName) {
    console.log('No matching role found!');
    return null;
  }

  const role = findRole(message, roleName);
  if (!role) {
    console.log(`Role ${roleName} not found!`);
    return null;
  }

  assignRole(message, role);
  return roleName;
}
// end of findAndAssignRole

export async function removeOneMemberRoles(member: GuildMember, rolesToRemove: string[]): Promise<void> {
  const removalPromises = rolesToRemove.map(async roleName => {
    const role = member.guild.roles.cache.find(r => r.name === roleName);
    if (!role) {
      console.log(`Role ${roleName} not found`);
      return;
    }
    console.log(`Removing role ${roleName} from user ${member.user.tag}`);
    try {
      await member.roles.remove(role);
    } catch (err) {
      console.log(`Failed to remove role ${roleName}:`, err);
    }
  });
  // end of removalPromises

  await Promise.all(removalPromises);
}
// end of removeOneMemberRoles

export async function removeBatchMembersRoles(message: Message, batchName: string, rolesToRemove: string[]) {
  const batchRole = findRole(message, batchName);
  const guildMembers = message.guild?.members.cache.filter(member => member.roles.cache.has(batchRole?.id!));

  if (guildMembers) {
    console.log(`Found members with batchName ${batchName}:`, guildMembers.map(member => member.user.tag));

    const removalPromises = guildMembers.map(async guildMember => {
      await removeOneMemberRoles(guildMember, rolesToRemove);
    });

    await Promise.all(removalPromises);
  }
}
// end of removeBatchMembersRoles