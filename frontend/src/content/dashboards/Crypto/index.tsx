import { Container, Grid } from "@mui/material";
import { Box } from "@mui/system";

import AccountBalance from "./AccountBalance";
import AccountSecurity from "./AccountSecurity";
import Wallets from "./Wallets";
import WatchList from "./WatchList";

function DashboardCrypto() {
  return (
    <>
      <title>Crypto Dashboard</title>

      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <AccountBalance />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
              }}
            >
              <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Wallets />
              </Box>
              <Box sx={{ width: { lg: "33.33%" }, padding: 2 }}>
                <AccountSecurity />
              </Box>
            </Box>
            <Box sx={{ padding: 2 }}>
              <WatchList />
            </Box>
          </Box>
        </Grid>
      </Container>
    </>
  );
}

export default DashboardCrypto;
