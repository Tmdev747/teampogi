import { Card } from "./ui/card";
import type { UserResponse } from "../types/user";
import { ChevronUp } from "lucide-react";

interface UserInfoProps {
  user: UserResponse;
  isAgent?: boolean;
}

export const UserInfo = ({ user, isAgent }: UserInfoProps) => {
  // Early return if user or user.user is undefined/null
  if (!user?.user) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No user data available</p>
      </Card>
    );
  }

  const userRole = isAgent ? 'Agent' : 'Player';

  const renderHierarchyNode = (node: any, index: number, totalNodes: number) => {
    if (!node) return null;

    let title = '';
    if (index === 0) {
      title = 'Top Manager';
    } else if (index === totalNodes - 1) {
      title = userRole;
    } else if (index === totalNodes - 2) {
      title = 'Direct Manager';
    } else {
      title = `Upline Manager ${totalNodes - index - 2}`;
    }

    return (
      <div key={node.id} className="relative">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-card/50 backdrop-blur-md rounded-xl shadow-sm p-3 w-48 border border-border/50">
            <div className="flex flex-col items-center">
              <span className="font-medium text-sm mb-1 text-foreground">
                {node.username}
              </span>
              <span className="text-xs px-3 py-0.5 bg-secondary/80 rounded-full text-secondary-foreground backdrop-blur-sm">
                {title}
              </span>
            </div>
          </div>
        </div>
        {index < totalNodes - 1 && (
          <>
            <div className="absolute h-4 w-px bg-border/50 left-1/2 -bottom-4 transform -translate-x-1/2"></div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="font-medium">{user.user.username}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Client ID</p>
            <p className="font-medium">{user.user.clientId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <div className="inline-block bg-secondary text-secondary-foreground font-bold px-4 py-1 rounded-full shadow-md">
              {userRole}
            </div>
          </div>
        </div>
      </Card>

      {Array.isArray(user.hierarchy) && user.hierarchy.length > 2 && (
        <Card className="relative p-6 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-xl border border-border/50">
          <h2 className="text-xl font-bold mb-6 text-foreground relative text-center">
            Organization Chart
          </h2>
          <div className="flex flex-col items-center space-y-0 relative">
            {user.hierarchy
              .slice(2)
              .map((node, index) => renderHierarchyNode(node, index, user.hierarchy.length - 2))}
          </div>
        </Card>
      )}
    </div>
  );
};