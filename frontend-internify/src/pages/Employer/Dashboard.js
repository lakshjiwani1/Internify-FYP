import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  CircularProgress,
  Container,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AddCircleOutline, MoreVert, Edit, Delete } from "@mui/icons-material";
import { useTheme } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUserState } from "../../store/user/user-slice";

const EmployerDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [internships, setInternships] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [viewApplicantDialogOpen, setViewApplicantDialogOpen] = useState(false);
  const open = Boolean(anchorEl);
  const user = useSelector(selectUserState);
  const [loading, setLoading] = useState(true);

  const handleClick = (event, internship) => {
    setAnchorEl(event.currentTarget);
    setSelectedInternship(internship);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedInternship(null);
  };

  const handleEdit = () => {
    navigate(`/internshipform/${selectedInternship.id}`);
    handleClose();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/delete_internship/${selectedInternship.id}/`,
        {
          headers: {
            "X-CSRFToken": user.token,
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setInternships(
        internships.filter(
          (internship) => internship.id !== selectedInternship.id
        )
      );
      setSnackbarMessage("Internship deleted successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting internship:", error);
    } finally {
      handleClose();
    }
  };

  const handleViewApplicants = async (internshipId) => {
    const url = `http://127.0.0.1:8000/count_applicants/${internshipId}/`;
    try {
      const response = await axios.get(url, {
        headers: {
          "X-CSRFToken": user.token,
          Authorization: `Bearer ${user.token}`,
        },
      });
      setApplicants(response.data.applicants);
      setApplicantsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  const handleAcceptApplication = async (application_id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/accept_application/${application_id}/`,
        {},
        {
          headers: {
            "X-CSRFToken": user.token,
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSnackbarMessage("Applicant Accepted Successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error accepting applicant:", error);
      setSnackbarMessage("Failed to Accept Applicant");
      console.log(application_id);
      setSnackbarOpen(true);
    }
  };

  const handleRejectApplication = async (application_id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/reject_application/${application_id}/`,
        {},
        {
          headers: {
            "X-CSRFToken": user.token,
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSnackbarMessage("Applicant Rejected Successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      setSnackbarMessage("Failed to Reject Applicant");
      setSnackbarOpen(open);
    }
  };

  const handleViewApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setViewApplicantDialogOpen(true);
  };

  const closeApplicantsDialog = () => {
    setApplicantsDialogOpen(false);
  };

  const closeViewApplicantDialog = () => {
    setViewApplicantDialogOpen(false);
  };

  const handleStatusChange = async (event, application) => {
    const application_status = event.target.value;
    try {
      if (application_status === "Accepted") {
        await handleAcceptApplication(application.application_id);
      } else if (application_status === "Rejected") {
        await handleRejectApplication(application.application_id);
      }
    } catch (error) {
      console.error("Error updating applicant status:", error);
    }
    console.log(application_status);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/internship_list/",
          {
            headers: {
              "X-CSRFToken": user.token,
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = response.data;
        if (Array.isArray(data.internships)) {
          const internshipsData = data.internships.map((item) => ({
            id: item.pk,
            ...item.fields,
          }));
          setInternships(internshipsData);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          marginTop: "2rem",
          marginBottom: "2rem",
          width: "70%",
          textAlign: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Grid container spacing={2} sx={{ width: "80%", margin: "auto" }}>
      <Grid
        item
        xs={12}
        sx={{ marginTop: "3rem", marginBottom: "2rem", textAlign: "center" }}
      >
        <Typography variant="h4">Employer Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "left", marginBottom: "2rem" }}>
        <Link to="/internshipform" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<AddCircleOutline />}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              textTransform: "none",
            }}
          >
            Post Internship
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center", marginBottom: "1rem" }}>
        <Typography variant="h5">Internships Posted</Typography>
      </Grid>
      <Grid item xs={12}>
        {internships.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{ marginBottom: "1rem", borderBottom: "2px solid #ccc" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Internship</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Applicants</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Application Deadline</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {internships.map((internship) => (
                  <TableRow key={internship.id}>
                    <TableCell>{internship.title}</TableCell>
                    <TableCell>{internship.start_date}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        onClick={() => handleViewApplicants(internship.id)}
                      >
                        {internship.number_of_applicants} Applicants
                      </Button>
                    </TableCell>
                    <TableCell>{internship.location}</TableCell>
                    <TableCell>{internship.application_deadline}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(event) => handleClick(event, internship)}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        id={`internship-menu-${internship.id}`}
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleEdit}>
                          <ListItemIcon>
                            <Edit fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Edit Internship</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                          <ListItemIcon>
                            <Delete fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Delete Internship</ListItemText>
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No internships posted yet.</Typography>
        )}
      </Grid>

      {/* Dialog for viewing applicants */}
      <Dialog
        open={applicantsDialogOpen}
        onClose={closeApplicantsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Applicants</DialogTitle>
        <DialogContent>
          {applicants.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Applicant Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applicants.map((applicant, index) => (
                    <TableRow key={applicant.application_id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {applicant.first_name} {applicant.last_name}
                      </TableCell>
                      <TableCell>{applicant.email}</TableCell>
                      <TableCell>
                        <FormControl fullWidth variant="standard">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={applicant.status || "Pending"} 
                            onChange={(event) =>
                              handleStatusChange(event, applicant)
                            }
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Accepted">Accepted</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          onClick={() => handleViewApplicant(applicant)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>
              No applicants available for this internship.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeApplicantsDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewApplicantDialogOpen}
        onClose={closeViewApplicantDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Applicant Details</DialogTitle>
        <DialogContent>
          {selectedApplicant ? (
            <Box>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedApplicant.first_name} {selectedApplicant.last_name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedApplicant.email}
              </Typography>
              <Typography variant="body1">
                <strong>Skills: </strong>
                {selectedApplicant.skills}
              </Typography>
              <Typography variant="body1">
                <strong>Education:</strong> {selectedApplicant.education}
              </Typography>
            </Box>
          ) : (
            <Typography>No applicant selected.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewApplicantDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default EmployerDashboard;
