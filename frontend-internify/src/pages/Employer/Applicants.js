import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/system";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUserState } from "../../store/user/user-slice";

const Applicants = () => {
  const theme = useTheme();
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantDialogOpen, setApplicantDialogOpen] = useState(false);
  const user = useSelector(selectUserState);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/internship_list/",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const internships = response.data.internships;
        let allApplicants = [];

        for (const internship of internships) {
          const applicantResponse = await axios.get(
            `http://127.0.0.1:8000/count_applicants/${internship.pk}/`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          const internshipData = applicantResponse.data;
          const applicantsData = internshipData.applicants.map((applicant) => ({
            ...applicant,
            internshipTitle: internshipData.title,
            internshipId: internshipData.id,
          }));

          allApplicants = [...allApplicants, ...applicantsData];
        }

        const uniqueApplicants = Array.from(
          new Map(
            allApplicants.map((applicant) => [applicant.email, applicant])
          ).values()
        );

        setApplicants(uniqueApplicants);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [user.token]);

  const handleViewApplicant = async (applicant) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/internship_list/",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const internships = response.data.internships;
      const internshipsForApplicant = [];

      for (const internship of internships) {
        const applicantResponse = await axios.get(
          `http://127.0.0.1:8000/count_applicants/${internship.pk}/`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const internshipData = applicantResponse.data;
        const applicantInInternship = internshipData.applicants.find(
          (app) => app.email === applicant.email
        );

        if (applicantInInternship) {
          internshipsForApplicant.push({
            internshipTitle: internshipData.title,
            applicationStatus: applicantInInternship.application_status,
          });
        }
      }

      setSelectedApplicant({
        ...applicant,
        internships: internshipsForApplicant,
      });
      setApplicantDialogOpen(true);
    } catch (error) {
      console.error("Error fetching internships for applicant:", error);
    }
  };

  const closeApplicantDialog = () => {
    setApplicantDialogOpen(false);
  };

  return (
    <Grid container spacing={2} sx={{ width: "80%", margin: "auto" }}>
      <Grid
        item
        xs={12}
        sx={{ marginTop: "3rem", marginBottom: "2rem", textAlign: "center" }}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Applicants
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {applicants.length > 0 ? (
          <Table
            component={Paper}
            sx={{
              borderBottom: "2px solid #ccc",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.email}>
                  <TableCell>{`${applicant.first_name} ${applicant.last_name}`}</TableCell>
                  <TableCell>{applicant.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                      }}
                      onClick={() => handleViewApplicant(applicant)}
                    >
                      View Applications
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No applicants found.</Typography>
        )}
      </Grid>

      {selectedApplicant && (
        <Dialog
          open={applicantDialogOpen}
          onClose={closeApplicantDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>{`${selectedApplicant.first_name} ${selectedApplicant.last_name}`}</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Internship</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedApplicant.internships.map((internship, index) => (
                  <TableRow key={index}>
                    <TableCell>{internship.internshipTitle}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor:
                            internship.applicationStatus === "Accepted"
                              ? "rgba(0, 128, 0, 0.2)" 
                              : internship.applicationStatus === "Rejected"
                              ? "rgba(255, 0, 0, 0.2)" 
                              : "rgba(255, 255, 0, 0.2)", 
                          color:
                            internship.applicationStatus === "Accepted"
                              ? "green"
                              : internship.applicationStatus === "Rejected"
                              ? "red"
                              : "gray",
                          textAlign: "center",
                          display: "inline-block",
                        }}
                      >
                        {internship.applicationStatus}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeApplicantDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Grid>
  );
};

export default Applicants;
