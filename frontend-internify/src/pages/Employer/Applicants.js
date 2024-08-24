import React, { useState } from "react";
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
  Container,
} from "@mui/material";
import { useTheme } from "@mui/system";

const Applicants = () => {
  const theme = useTheme();
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantDialogOpen, setApplicantDialogOpen] = useState(false);

  // Dummy Data for Applicants
  const applicants = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      internships: [
        { id: 1, title: "Software Engineer Intern", status: "Accepted" },
        { id: 2, title: "Frontend Developer Intern", status: "Pending" },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      internships: [
        { id: 3, title: "Data Scientist Intern", status: "Rejected" },
        { id: 4, title: "Backend Developer Intern", status: "Pending" },
      ],
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      internships: [
        { id: 5, title: "Product Manager Intern", status: "Accepted" },
      ],
    },
  ];

  const handleViewApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setApplicantDialogOpen(true);
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
                <TableRow key={applicant.id}>
                  <TableCell>{applicant.name}</TableCell>
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
                      View Applicant
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
          <DialogTitle>{selectedApplicant.name}</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Internship</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedApplicant.internships.map((internship) => (
                  <TableRow key={internship.id}>
                    <TableCell>{internship.title}</TableCell>
                    <TableCell>{internship.status}</TableCell>
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
