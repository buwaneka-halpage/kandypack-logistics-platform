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
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "~/hooks/use-toast";
import { TruckSchedulesAPI, DriversAPI, AssistantsAPI } from "~/services/api";

interface AssignRosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Driver {
  driver_id: string;
  name: string;
  weekly_working_hours: number;
  user_id: string;
}

interface Assistant {
  assistant_id: string;
  name: string;
  weekly_working_hours: number;
  user_id: string;
}

interface TruckSchedule {
  schedule_id: string;
  route_id: string;
  truck_id: string;
  scheduled_date: string;
  departure_time: string;
  duration: number;
  status: string;
}

interface ValidationResult {
  valid: boolean;
  message: string;
  type: "success" | "error" | "warning";
}

export default function AssignRosterDialog({
  open,
  onOpenChange,
  onSuccess,
}: AssignRosterDialogProps) {
  const [formData, setFormData] = useState({
    schedule_id: "",
    driver_id: "",
    assistant_id: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [schedules, setSchedules] = useState<TruckSchedule[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  
  const [driverValidation, setDriverValidation] = useState<ValidationResult | null>(null);
  const [assistantValidation, setAssistantValidation] = useState<ValidationResult | null>(null);

  // Fetch available data
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [schedulesData, driversData, assistantsData] = await Promise.all([
        TruckSchedulesAPI.getAll(),
        DriversAPI.getAll(),
        AssistantsAPI.getAll(),
      ]);
      
      // Filter schedules that need assignment (PLANNED status)
      const needsAssignment = schedulesData.filter(
        (s: TruckSchedule) => s.status === "PLANNED"
      );
      
      setSchedules(needsAssignment);
      setDrivers(driversData);
      setAssistants(assistantsData);
    } catch (err: any) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  // Validate driver selection based on business rules
  const validateDriver = (driverId: string, scheduleId: string) => {
    if (!driverId || !scheduleId) {
      setDriverValidation(null);
      return;
    }

    const driver = drivers.find((d) => d.driver_id === driverId);
    if (!driver) return;

    const selectedSchedule = schedules.find((s) => s.schedule_id === scheduleId);
    if (!selectedSchedule) return;

    // Check weekly hour limit (40 hours max for drivers)
    const hoursAfterAssignment = driver.weekly_working_hours + (selectedSchedule.duration / 60);
    
    if (hoursAfterAssignment > 40) {
      setDriverValidation({
        valid: false,
        message: `❌ Driver exceeds 40-hour weekly limit (Currently: ${driver.weekly_working_hours}h, After: ${hoursAfterAssignment.toFixed(1)}h)`,
        type: "error",
      });
      return;
    }

    if (hoursAfterAssignment > 35) {
      setDriverValidation({
        valid: true,
        message: `⚠️ Warning: Driver approaching 40-hour limit (${hoursAfterAssignment.toFixed(1)}h/40h)`,
        type: "warning",
      });
      return;
    }

    setDriverValidation({
      valid: true,
      message: `✅ Valid - ${driver.name} has ${(40 - hoursAfterAssignment).toFixed(1)} hours remaining`,
      type: "success",
    });
  };

  // Validate assistant selection based on business rules
  const validateAssistant = (assistantId: string, scheduleId: string) => {
    if (!assistantId || !scheduleId) {
      setAssistantValidation(null);
      return;
    }

    const assistant = assistants.find((a) => a.assistant_id === assistantId);
    if (!assistant) return;

    const selectedSchedule = schedules.find((s) => s.schedule_id === scheduleId);
    if (!selectedSchedule) return;

    // Check weekly hour limit (60 hours max for assistants)
    const hoursAfterAssignment = assistant.weekly_working_hours + (selectedSchedule.duration / 60);
    
    if (hoursAfterAssignment > 60) {
      setAssistantValidation({
        valid: false,
        message: `❌ Assistant exceeds 60-hour weekly limit (Currently: ${assistant.weekly_working_hours}h, After: ${hoursAfterAssignment.toFixed(1)}h)`,
        type: "error",
      });
      return;
    }

    if (hoursAfterAssignment > 55) {
      setAssistantValidation({
        valid: true,
        message: `⚠️ Warning: Assistant approaching 60-hour limit (${hoursAfterAssignment.toFixed(1)}h/60h)`,
        type: "warning",
      });
      return;
    }

    setAssistantValidation({
      valid: true,
      message: `✅ Valid - ${assistant.name} has ${(60 - hoursAfterAssignment).toFixed(1)} hours remaining`,
      type: "success",
    });
  };

  // Handle driver selection
  const handleDriverChange = (driverId: string) => {
    setFormData({ ...formData, driver_id: driverId });
    validateDriver(driverId, formData.schedule_id);
  };

  // Handle assistant selection
  const handleAssistantChange = (assistantId: string) => {
    setFormData({ ...formData, assistant_id: assistantId });
    validateAssistant(assistantId, formData.schedule_id);
  };

  // Handle schedule selection
  const handleScheduleChange = (scheduleId: string) => {
    setFormData({ ...formData, schedule_id: scheduleId });
    validateDriver(formData.driver_id, scheduleId);
    validateAssistant(formData.assistant_id, scheduleId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.schedule_id || !formData.driver_id || !formData.assistant_id) {
      setError("Please select schedule, driver, and assistant");
      return;
    }

    // Check if validations passed
    if (!driverValidation?.valid || !assistantValidation?.valid) {
      setError("Cannot assign - validation constraints not met");
      return;
    }

    setLoading(true);

    try {
      const schedule = schedules.find((s) => s.schedule_id === formData.schedule_id);
      
      // Update the truck schedule with driver and assistant assignments
      // Only send the fields that need to be updated to avoid validation errors
      await TruckSchedulesAPI.update(formData.schedule_id, {
        driver_id: formData.driver_id,
        assistant_id: formData.assistant_id,
      });

      // Update driver and assistant working hours
      const driver = drivers.find((d) => d.driver_id === formData.driver_id);
      const assistant = assistants.find((a) => a.assistant_id === formData.assistant_id);
      
      if (driver && schedule) {
        await DriversAPI.update(formData.driver_id, {
          weekly_working_hours: Math.floor(schedule.duration / 60),
        });
      }

      if (assistant && schedule) {
        await AssistantsAPI.update(formData.assistant_id, {
          weekly_working_hours: Math.floor(schedule.duration / 60),
        });
      }

      toast({
        title: "Success!",
        description: "Driver and assistant assigned successfully to the route.",
      });

      // Reset form
      setFormData({
        schedule_id: "",
        driver_id: "",
        assistant_id: "",
      });
      setDriverValidation(null);
      setAssistantValidation(null);
      
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to assign roster. Please try again.");
      toast({
        title: "Error",
        description: err.message || "Failed to assign roster.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        schedule_id: "",
        driver_id: "",
        assistant_id: "",
      });
      setError(null);
      setDriverValidation(null);
      setAssistantValidation(null);
      onOpenChange(false);
    }
  };

  const getValidationIcon = (validation: ValidationResult | null) => {
    if (!validation) return null;
    if (validation.type === "success") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (validation.type === "warning") return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Driver & Assistant to Route</DialogTitle>
          <DialogDescription>
            Select a truck schedule and assign a driver and assistant. The system validates all business constraints.
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Schedule Selection */}
              <div className="grid gap-2">
                <Label htmlFor="schedule">Truck Schedule *</Label>
                <Select
                  value={formData.schedule_id}
                  onValueChange={handleScheduleChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No schedules available
                      </SelectItem>
                    ) : (
                      schedules.map((schedule) => (
                        <SelectItem key={schedule.schedule_id} value={schedule.schedule_id}>
                          {schedule.scheduled_date} - {schedule.departure_time} ({schedule.duration} min)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Driver Selection */}
              <div className="grid gap-2">
                <Label htmlFor="driver">Driver *</Label>
                <Select
                  value={formData.driver_id}
                  onValueChange={handleDriverChange}
                  disabled={loading || !formData.schedule_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.driver_id} value={driver.driver_id}>
                        {driver.name} ({driver.weekly_working_hours}h/40h worked)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {driverValidation && (
                  <div className={`flex items-start gap-2 text-sm p-2 rounded ${
                    driverValidation.type === "success" ? "bg-green-50 text-green-700" :
                    driverValidation.type === "warning" ? "bg-yellow-50 text-yellow-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {getValidationIcon(driverValidation)}
                    <span>{driverValidation.message}</span>
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  ⚠️ Constraint: Drivers cannot work consecutive routes (max 40h/week)
                </p>
              </div>

              {/* Assistant Selection */}
              <div className="grid gap-2">
                <Label htmlFor="assistant">Assistant *</Label>
                <Select
                  value={formData.assistant_id}
                  onValueChange={handleAssistantChange}
                  disabled={loading || !formData.schedule_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assistant" />
                  </SelectTrigger>
                  <SelectContent>
                    {assistants.map((assistant) => (
                      <SelectItem key={assistant.assistant_id} value={assistant.assistant_id}>
                        {assistant.name} ({assistant.weekly_working_hours}h/60h worked)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {assistantValidation && (
                  <div className={`flex items-start gap-2 text-sm p-2 rounded ${
                    assistantValidation.type === "success" ? "bg-green-50 text-green-700" :
                    assistantValidation.type === "warning" ? "bg-yellow-50 text-yellow-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {getValidationIcon(assistantValidation)}
                    <span>{assistantValidation.message}</span>
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  ⚠️ Constraint: Assistants can work max 2 consecutive routes (max 60h/week)
                </p>
              </div>

              {/* Business Rules Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                <h4 className="font-semibold mb-2">📋 Business Rules:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Drivers: Max 40 hours/week, no consecutive routes</li>
                  <li>Assistants: Max 60 hours/week, max 2 consecutive routes</li>
                  <li>No overlapping route assignments allowed</li>
                </ul>
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
              <Button 
                type="submit" 
                disabled={loading || !driverValidation?.valid || !assistantValidation?.valid}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Assign Roster"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

