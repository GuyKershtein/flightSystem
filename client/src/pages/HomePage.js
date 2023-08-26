import React, { useEffect, useState } from 'react';
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BasicPage } from "../components/BasicPage";
import Home from "@mui/icons-material/Home";
import Person from "@mui/icons-material/Person";

function HomePage() {

    return <Container component="main" maxWidth="xs">
              <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              >
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}><Person /></Avatar>
                <div>
                </div>
              </Box>
            </Container>;
}

export default HomePage;