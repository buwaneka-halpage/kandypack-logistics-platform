import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "~/hooks/use-toast";

interface EditAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  user: {
    user_id: string;
    user_name: string;
    role: string;
  } | null;
}

const ROLES = [
  { value: "SystemAdmin", label: "System Admin" },
  { value: "Management", label: "Management" },
  { value: "StoreManager", label: "Store Manager" },
  { value: "Driver", label: "Driver" },
  { value: "Assistant", label: "Driver Assistant" },
  { value: "WarehouseStaff", label: "Warehouse Staff" },
];

export default function EditAdminDialog({ open, onOpenChange, onSuccess, user }: EditAdminDialogProps) {
  const [formData, setFormData] = useState({
    user_name: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        user_name: user.user_name,
        password: "",
        confirmPassword: "",
        role: user.role,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) return;

    // Validation
    if (!formData.user_name || !formData.role) {
      setError("Username and role are required");
      return;
    }

    // If password is provided, validate it
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
    }

    setLoading(true);

    try {
      const { UsersAPI } = await import("~/services/api");
      
      // Prepare update data - only include password if it was changed
      const updateData: any = {
        user_name: formData.user_name,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await UsersAPI.update(user.user_id, updateData);

      toast({
        title: "Success!",
        description: `User "${formData.user_name}" has been updated successfully.`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to update user. Please try again.");
      toast({
        title: "Error",
        description: err.message || "Failed to update user. Please try again.",
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogDescription>
            Update user information. Leave password fields empty to keep the current password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit_user_name">Username *</Label>
              <Input
                id="edit_user_name"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                placeholder="Enter username"
                disabled={loading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">
                Change Password (Optional)
              </p>

              <div className="grid gap-2 mb-3">
                <Label htmlFor="edit_password">New Password</Label>
                <Input
                  id="edit_password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave empty to keep current password"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">Minimum 6 characters</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_confirmPassword">Confirm New Password</Label>
                <Input
                  id="edit_confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>
            </div>
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
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Admin"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

