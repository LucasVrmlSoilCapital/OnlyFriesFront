import React from 'react';

interface User {
  id: string;
  email: string;
  has_ordered: boolean;
}

interface UserStatusListProps {
  orderedUsers: User[];
  pendingUsers: User[];
}

export const UserStatusList: React.FC<UserStatusListProps> = ({
  orderedUsers,
  pendingUsers
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-cream-400">
      <h3 className="text-xl font-bold text-warm-800 mb-4">Statut des participants</h3>
      
      {/* Utilisateurs qui ont commandé */}
      <div className="mb-4">
        <h4 className="font-semibold text-success-700 mb-2 flex items-center">
          <span className="w-3 h-3 bg-success-500 rounded-full mr-2"></span>
          Ont commandé ({orderedUsers.length})
        </h4>
        <div className="space-y-1">
          {orderedUsers.map(user => (
            <div key={user.id} className="text-sm text-success-800 bg-success-50 px-2 py-1 rounded border border-success-200">
              {user.email}
            </div>
          ))}
        </div>
      </div>

      {/* Utilisateurs en attente */}
      <div>
        <h4 className="font-semibold text-warning-700 mb-2 flex items-center">
          <span className="w-3 h-3 bg-warning-500 rounded-full mr-2"></span>
          En attente ({pendingUsers.length})
        </h4>
        <div className="space-y-1">
          {pendingUsers.map(user => (
            <div key={user.id} className="text-sm text-warning-800 bg-warning-50 px-2 py-1 rounded border border-warning-200">
              {user.email}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 