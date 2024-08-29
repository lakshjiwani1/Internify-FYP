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
  TextField,
  InputAdornment,
  FormControl,
  Select,
} from "@mui/material";
import {
  AddCircleOutline,
  MoreVert,
  Edit,
  Delete,
  Search,
} from "@mui/icons-material";
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
  const [filteredInternships, setFilteredInternships] = useState([]); // To handle search results
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [viewApplicantDialogOpen, setViewApplicantDialogOpen] = useState(false);
  const [editingApplicantId, setEditingApplicantId] = useState(null);
  const open = Boolean(anchorEl);
  const user = useSelector(selectUserState);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleEditStatus = (applicantId) => {
    setEditingApplicantId(applicantId);
  };

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      const url =
        newStatus === "Accepted"
          ? `http://127.0.0.1:8000/accept_application/${applicantId}/`
          : `http://127.0.0.1:8000/reject_application/${applicantId}/`;

      await axios.post(
        url,
        {},
        {
          headers: {
            "X-CSRFToken": user.token,
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant.application_id === applicantId
            ? { ...applicant, application_status: newStatus }
            : applicant
        )
      );

    setSnackbarMessage(
      newStatus === "Accepted"
        ? "Applicant Accepted Successfully!"
        : "Applicant Rejected Successfully!"
    );
    setSnackbarOpen(true);  

      setEditingApplicantId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getInternshipStatus = (deadline) => {
    const currentDateTime = new Date();
    const deadlineDateTime = new Date(deadline);
    return deadlineDateTime > currentDateTime ? "Open" : "Closed";
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
          setFilteredInternships(internshipsData); 
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

  const handleSearch = () => {
    const filtered = internships.filter((internship) =>
      internship.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInternships(filtered);
  };

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
        sx={{ marginTop: "4rem", marginBottom: "4rem", textAlign: "center" }}
      >
        <Typography variant="h4">Employer Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "left", marginBottom: "0.5rem" }}>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={9}>
            <Grid container alignItems="center">
              <Grid item xs>
                <TextField
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Search internships"
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item>
                <IconButton
                  onClick={handleSearch}
                  sx={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    borderRadius: "4px",
                    marginLeft: "8px",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  <Search />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3} sx={{ textAlign: "right" }}>
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
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {filteredInternships.length > 0 ? (
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
                  <TableCell>Internship Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInternships.map((internship) => (
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
                    <TableCell>
                      <Box
                        sx={{
                          padding: "4px 2px",
                          borderRadius: "4px",
                          backgroundColor:
                            getInternshipStatus(
                              internship.application_deadline
                            ) === "Open"
                              ? "rgba(0, 128, 0, 0.3)"
                              : "rgba(255, 0, 0, 0.3)",
                          color:
                            getInternshipStatus(
                              internship.application_deadline
                            ) === "Open"
                              ? "green"
                              : "red",
                          textAlign: "center",
                          width: "80px",
                        }}
                      >
                        {getInternshipStatus(internship.application_deadline)}
                      </Box>
                    </TableCell>
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
                    <TableCell>Applicant Details</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
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
                        <Button
                          variant="text"
                          onClick={() => handleViewApplicant(applicant)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                      <TableCell>
                        {editingApplicantId === applicant.application_id ? (
                          <FormControl fullWidth>
                            <Select
                              value={applicant.application_status}
                              onChange={(e) =>
                                handleStatusChange(
                                  applicant.application_id,
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="Accepted">Accepted</MenuItem>
                              <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          <Box
                            sx={{
                              padding: "4px 4px",
                              borderRadius: "4px",
                              backgroundColor:
                                applicant.application_status === "Accepted"
                                  ? "rgba(0, 128, 0, 0.3)"
                                  : applicant.application_status === "Rejected"
                                    ? "rgba(255, 0, 0, 0.3)"
                                    : "rgba(255, 255, 0, 0.3)",
                              color:
                                applicant.application_status === "Accepted"
                                  ? "green"
                                  : applicant.application_status === "Rejected"
                                    ? "red"
                                    : "gray",
                              textAlign: "center",
                              display: "inline-block",
                              marginRight: "8px",
                            }}
                          >
                            {applicant.application_status}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingApplicantId ===
                        applicant.application_id ? null : (
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleEditStatus(applicant.application_id)
                            }
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
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
                <strong>Name:</strong> {selectedApplicant.first_name}{" "}
                {selectedApplicant.last_name}
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
