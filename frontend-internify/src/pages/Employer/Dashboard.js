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
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      setFilteredInternships(
        filteredInternships.filter(
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

  const handleAcceptApplication = (applicantId) => {
    setSnackbarMessage("Applicant Accepted Successfully");
    setSnackbarOpen(true);
  };

  const handleRejectApplication = (applicantId) => {
    setSnackbarMessage("Applicant Rejected Successfully");
    setSnackbarOpen(true);
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
        sx={{ marginTop: "3rem", marginBottom: "2rem", textAlign: "center" }} // Centered title
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}> 
          Employer Dashboard
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ textAlign: "center", marginBottom: "2rem" }}>
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


      <Grid item xs={12} sx={{ textAlign: "center", marginBottom: "1rem" }}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{ maxWidth: "100%" }}
        >
          <Grid item xs={9}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Internship"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ height: "40px", marginTop: "4px" }}
              InputProps={{
                sx: { height: "40px" }, // Reduce the height
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              startIcon={<Search />}
              sx={{
                height: "40px",
                backgroundColor: theme.palette.primary.main,
                color: "white",
                width: "100%",
              }}
              onClick={handleSearch}
            />
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
                  <TableCell>Application Deadline</TableCell>
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
          <Typography
            variant="body1"
            sx={{ textAlign: "center", marginBottom: "1rem" }}
          >
            No internships posted.
          </Typography>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Education</TableCell>
                    <TableCell>Skills</TableCell>
                    <TableCell>View Full Application</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        {applicant.student__first_name}{" "}
                        {applicant.student__last_name}
                      </TableCell>
                      <TableCell>{applicant.student__qualification}</TableCell>
                      <TableCell>{applicant.student__skills}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          onClick={() => handleViewApplicant(applicant)}
                        >
                          View Full Application
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAcceptApplication(applicant.id)}
                          sx={{ marginRight: "0.5rem" }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRejectApplication(applicant.id)}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No applicants yet.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeApplicantsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewApplicantDialogOpen}
        onClose={closeViewApplicantDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Applicant Details</DialogTitle>
        <DialogContent>
          {selectedApplicant ? (
            <Box>
              <Typography variant="h6">
                Name: {selectedApplicant.student__first_name}{" "}
                {selectedApplicant.student__last_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Email: {selectedApplicant.student__email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Phone: {selectedApplicant.student__phone}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Address: {selectedApplicant.student__address}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Qualification: {selectedApplicant.student__qualification}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Experience: {selectedApplicant.student__experience}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Skills: {selectedApplicant.student__skills}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1">
              No applicant details available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewApplicantDialog} color="primary">
            Close
          </Button>
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
