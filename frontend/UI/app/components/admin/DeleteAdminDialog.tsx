import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "~/hooks/use-toast";

interface DeleteAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  user: {
    user_id: string;
    user_name: string;
    role: string;
  } | null;
}

export default function DeleteAdminDialog({
  open,
  onOpenChange,
  onSuccess,
  user,
}: DeleteAdminDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { UsersAPI } = await import("~/services/api");
      await UsersAPI.delete(user.user_id);

      toast({
        title: "Success!",
        description: `User "${user.user_name}" has been deleted successfully.`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to delete user. Please try again.");
      toast({
        title: "Error",
        description: err.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Admin User
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the user account.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {user && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid gap-2">
                <div>
                  <span className="text-sm text-gray-600">Username:</span>
                  <p className="font-medium">{user.user_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Role:</span>
                  <p className="font-medium">{user.role}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">User ID:</span>
                  <p className="font-mono text-sm">{user.user_id}</p>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 mt-4">
            Are you sure you want to delete this user? They will no longer be able to log in or
            access the system.
          </p>
        </div>

        <DialogFooter className="!flex-row !justify-end !space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

