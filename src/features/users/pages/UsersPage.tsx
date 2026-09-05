import { CreateUserForm } from '../components/CreateUserForm';
import { UserList } from '../components/UserList';

export function UsersPage() {
  return (
    <main>
      <h1>Users</h1>
      <CreateUserForm />
      <UserList />
    </main>
  );
}
