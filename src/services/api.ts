import type { UserResponse } from "../types/user";

export const fetchUserData = async (username: string, isAgent: boolean): Promise<UserResponse> => {
  const response = await fetch(
    `https://bridge.747lc.com/Default/GetHierarchy?username=${encodeURIComponent(username)}&isAgent=${isAgent}`,
    {
      headers: {
        accept: "text/plain",
      }
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
};