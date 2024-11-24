interface HierarchyNode {
  id: number;
  clientId: number;
  username: string;
  parentClientId: number | null;
}

export interface UserResponse {
  hierarchy: HierarchyNode[];
  user: HierarchyNode;
  status: number;
  message: string;
}