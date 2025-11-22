const USER_ID_KEY = 'hazwoper_chat_user_id';

/**
 * Gets or creates a persistent user ID for the chat session.
 * The ID is stored in localStorage and persists across page refreshes.
 *
 * @returns A unique user identifier
 */
export const getOrCreateUserId = (): string => {
  const stored = localStorage.getItem(USER_ID_KEY);
  if (stored) {
    return stored;
  }

  const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem(USER_ID_KEY, newUserId);
  return newUserId;
};

