'use client';

import { useUser } from '@/lib/hooks/useUser';

export default function UserProfile() {
  const { user, signOut } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <div className="text-sm font-medium text-gray-200">
          {user.user_metadata?.full_name || user.email}
        </div>
        <div className="text-xs text-gray-400">
          {user.email}
        </div>
      </div>
      <button
        onClick={signOut}
        className="btn bg-linear-to-t from-red-600 to-red-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] text-sm px-4 py-2"
      >
        Sign Out
      </button>
    </div>
  );
} 