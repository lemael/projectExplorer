import { Avatar, Grid, alpha, styled, useTheme } from "@mui/material";

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(0, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
      theme.palette.mode === "dark"
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

function WatchListColumn() {
  const theme = useTheme();

  const chart1Data = [
    {
      name: "Bitcoin Price",
      data: [55.701, 57.598, 48.607, 46.439, 58.755, 46.978, 58.16],
    },
  ];
  const chart2Data = [
    {
      name: "Ethereum Price",
      data: [13, 16, 14, 20, 8, 11, 20],
    },
  ];
  const chart3Data = [
    {
      name: "Cardano Price",
      data: [51.85, 41.77, 22.09, 42.0, 71.9, 51.84, 31.84],
    },
  ];

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={3}
    ></Grid>
  );
}

export default WatchListColumn;
