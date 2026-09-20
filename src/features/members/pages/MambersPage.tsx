import { CreateMemberForm } from '../components/CreateMemberForm';
import { MemberList } from '../components/MemberList';

export function MembersPage() {
  return (
    <main>
      <h1>Members</h1>
      <CreateMemberForm />
      <MemberList />
    </main>
  );
}
