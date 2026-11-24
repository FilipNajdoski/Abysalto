import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="card">
      <h2>My profile</h2>
      <dl className="details">
        <dt>Name</dt>
        <dd>{user.firstName} {user.lastName}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Member since</dt>
        <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
      </dl>
    </div>
  );
}
