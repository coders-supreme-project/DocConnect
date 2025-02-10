import * as React from "react";
const { useState, useEffect } = React;
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";

dayjs.extend(relativeTime);

const statusOptions = ["rejected", "confirmed", "pending"];

interface AppointmentListProps {
  appointments: any[];
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  const now = dayjs();
  const userEmail = localStorage.getItem("userEmail");
  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    appointment: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
    setSelectedStatus(appointment.Status || "");
  };

  const handleClose = () => setAnchorEl(null);

  const handleChangeStatus = async (status: string) => {
    if (selectedAppointment) {
      if (status === "confirmed") {
        setOpenDialog(true);
      } else {
        await updateAppointmentStatus(selectedAppointment.AppointmentID, status);
        handleClose();
      }
    }
  };

  const handleConfirmAppointment = async () => {
    if (selectedAppointment) {
      await updateAppointmentStatus(selectedAppointment.AppointmentID, "confirmed");
      setOpenDialog(false);
      handleClose();
    }
  };

  const createZoomMeeting = async (doctorEmail: string, patientEmail: string, startTime: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/vedio/create-meeting', {
        doctorEmail,
        patientEmail,
        topic: "Consultation Meeting",
        startTime,
      });

      if (response.data.meetingLink) {
        console.log("Zoom meeting created:", response.data.meetingLink);
        return response.data.meetingLink;
      }
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
      alert("Failed to create Zoom meeting. Please try again.");
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointment/update/${appointmentId}`,
        { status }
      );

      if (response.status === 200) {
        // Update the local state to reflect the new status
        setLocalAppointments((prevAppointments) =>
          prevAppointments.map((app) =>
            app.AppointmentID === appointmentId ? { ...app, Status: status } : app
          )
        );

        // If the appointment is confirmed and type is "distance", create a Zoom meeting
        if (status === "confirmed" && selectedAppointment?.Type === "distance") {
          const { Doctor, Patient, AppointmentDate } = selectedAppointment;

          // Format the appointment date for Zoom
          const startTime = dayjs(AppointmentDate).toISOString();

          // Create Zoom meeting and send emails
          const meetingLink = await createZoomMeeting("sadokdronga@gmail.com", "sadokdronga@gmail.com", startTime);

          if (meetingLink) {
            console.log("Hello sick person ,here is the Zoom meeting link with doctor :", meetingLink);
          }
        }
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Failed to update appointment status. Please try again.");
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Appointment Requests
      </Typography>
      <List>
        {localAppointments.length ? (
          localAppointments.map((appointment: any, index: number) => {
            const { Status = "", createdAt, Patient, Type } = appointment;
            return (
              <ListItem key={appointment.AppointmentID} divider>
                <ListItemAvatar>
                  <Avatar src={`https://i.pravatar.cc/150?img=${index + 1}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${Patient.FirstName} ${Patient.LastName}`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        {dayjs(appointment.AppointmentDate).format("MMMM D, YYYY h:mm A")}
                      </Typography>
                      <Typography variant="body2">
                        {createdAt ? now.from(createdAt) : null}
                      </Typography>
                      <Typography variant="body2">
                        Type: {Type || "N/A"}
                      </Typography>
                    </>
                  }
                />
                <Chip
                  label={Status}
                  color={
                    Status === "pending"
                      ? "warning"
                      : Status === "rejected"
                      ? "error"
                      : "success"
                  }
                  size="small"
                  onClick={(event) => handleClick(event, appointment)}
                />
              </ListItem>
            );
          })
        ) : (
          <Typography>No appointments found</Typography>
        )}
      </List>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {statusOptions.map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleChangeStatus(status)}
            selected={status === selectedStatus}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Typography>
              Are you sure you want to confirm the appointment for{" "}
              {selectedAppointment.Patient.FirstName}{" "}
              {selectedAppointment.Patient.LastName}?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmAppointment} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppointmentList;