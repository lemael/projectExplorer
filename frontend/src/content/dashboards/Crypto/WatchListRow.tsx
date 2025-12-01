import { alpha, Avatar, styled, useTheme } from "@mui/material";

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

function WatchListRow() {
  const theme = useTheme();

  const Box1Options = {
    chart: {
      animations: {
        enabled: false,
      },
      background: "transparent",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      zoom: {
        enabled: false,
      },
    },
    labels: [
      "Monday",
      "Tueday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    stroke: {
      curve: "smooth",
      colors: [theme.colors.primary.main],
      width: 2,
    },
    yaxis: {
      show: false,
    },
    colors: [theme.colors.primary.main],
    grid: {
      padding: {
        top: 10,
        right: 5,
        bottom: 10,
        left: 5,
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fixed: {
        enabled: true,
      },
      x: {
        show: true,
      },
      y: {
        title: {
          formatter: function () {
            return "Price: $";
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };

  const Box1Data = [
    {
      name: "Bitcoin",
      data: [55.701, 57.598, 48.607, 46.439, 58.755, 46.978, 58.16],
    },
  ];

  const Box2Data = [
    {
      name: "Ethereum",
      data: [1.854, 1.873, 1.992, 2.009, 1.909, 1.942, 1.884],
    },
  ];

  const Box3Data = [
    {
      name: "Cardano",
      data: [13, 16, 14, 18, 8, 11, 20],
    },
  ];

  return <div>WatchListRow</div>;
}

export default WatchListRow;
