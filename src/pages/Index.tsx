import { useState } from "react";
import { UserSearch } from "@/components/UserSearch";
import { UserInfo } from "@/components/UserInfo";
import { fetchUserData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import type { UserResponse } from "@/types/user";
import Header from "@/components/Header";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [agentData, setAgentData] = useState<UserResponse | null>(null);
  const [playerData, setPlayerData] = useState<UserResponse | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (username: string, isAgent: boolean) => {
    setAgentData(null);
    setPlayerData(null);
    setShowResults(false);
    setShowDuplicateWarning(false);
    setWarningAcknowledged(false);
    
    setIsLoading(true);
    try {
      const [agentResponse, playerResponse] = await Promise.all([
        fetchUserData(username, true),
        fetchUserData(username, false),
      ]);

      const hasAgentAccount = agentResponse.status === 0;
      const hasPlayerAccount = playerResponse.status === 0;

      if (hasAgentAccount && hasPlayerAccount) {
        setShowDuplicateWarning(true);
        setAgentData(agentResponse);
        setPlayerData(playerResponse);
      } else {
        setAgentData(agentResponse);
        setPlayerData(playerResponse);
        setShowResults(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWarningAcknowledge = () => {
    if (!warningAcknowledged) {
      toast({
        title: "Warning",
        description: "Please check the acknowledgment checkbox first.",
        variant: "destructive",
      });
      return;
    }
    setShowDuplicateWarning(false);
    setShowResults(true);
  };

  const hasBothAccounts = agentData?.status === 0 && playerData?.status === 0;
  const hasAgentAccount = agentData?.status === 0;
  const hasPlayerAccount = playerData?.status === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <UserSearch onSearch={handleSearch} isLoading={isLoading} />
        
        {showResults && (
          <div className="mt-8 space-y-4">
            {hasBothAccounts && (
              <div className="bg-destructive border-2 border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
                  <span className="text-destructive-foreground font-semibold animate-pulse">
                    Warning: This user has both agent and player accounts!
                  </span>
                </div>
              </div>
            )}

            {hasBothAccounts ? (
              <Tabs defaultValue="agent" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="agent">Agent Account</TabsTrigger>
                  <TabsTrigger value="player">Player Account</TabsTrigger>
                </TabsList>
                <TabsContent value="agent">
                  {agentData && <UserInfo user={agentData} isAgent={true} />}
                </TabsContent>
                <TabsContent value="player">
                  {playerData && <UserInfo user={playerData} isAgent={false} />}
                </TabsContent>
              </Tabs>
            ) : (
              <div>
                {hasAgentAccount && <UserInfo user={agentData!} isAgent={true} />}
                {hasPlayerAccount && <UserInfo user={playerData!} isAgent={false} />}
              </div>
            )}
          </div>
        )}

        <AlertDialog open={showDuplicateWarning} onOpenChange={setShowDuplicateWarning}>
          <AlertDialogContent className="bg-destructive text-destructive-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Duplicate Account Warning</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-destructive-foreground/90">
                This username has both agent and player accounts. Please exercise caution when processing transactions as this may indicate potential fraud or could lead to processing errors. Double-check all details before proceeding with any transactions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4 flex items-center space-x-2">
              <Checkbox
                id="warningAcknowledgment"
                checked={warningAcknowledged}
                onCheckedChange={(checked) => setWarningAcknowledged(checked as boolean)}
                className="border-destructive-foreground data-[state=checked]:bg-destructive-foreground data-[state=checked]:text-destructive"
              />
              <label
                htmlFor="warningAcknowledgment"
                className="text-sm font-medium text-destructive-foreground"
              >
                I understand the risks associated with duplicate accounts
              </label>
            </div>
            <AlertDialogFooter className="mt-4">
              <Button
                onClick={handleWarningAcknowledge}
                className="w-full bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
              >
                I Understand
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Index;