import { memberLabel, type Member } from '@/features/members/schemas/member.schema';

type AuthorSource = Pick<Member, 'user_id' | 'display_name' | 'email'>;

export function commentAuthorLabel({
  userId,
  members,
  people = [],
  currentUserId,
  currentUserLabel,
}: {
  userId: string;
  members: Member[];
  people?: AuthorSource[];
  currentUserId?: string | undefined;
  currentUserLabel?: string | undefined;
}): string {
  const member = members.find((entry) => entry.user_id === userId);
  if (member) {
    return memberLabel(member);
  }

  const person = people.find((entry) => entry.user_id === userId);
  if (person) {
    return memberLabel(person);
  }

  if (currentUserId === userId && currentUserLabel) {
    return currentUserLabel;
  }

  return userId;
}
