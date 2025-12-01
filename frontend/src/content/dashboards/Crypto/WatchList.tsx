import TableRowsTwoToneIcon from "@mui/icons-material/TableRowsTwoTone";
import ViewWeekTwoToneIcon from "@mui/icons-material/ViewWeekTwoTone";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
} from "@mui/material";
import { MouseEvent, useState } from "react";

const EmptyResultsWrapper = styled("img")(
  ({ theme }) => `
      max-width: 100%;
      width: ${theme.spacing(66)};
      height: ${theme.spacing(34)};
`
);

function WatchList() {
  const [tabs, setTab] = useState<string | null>("watch_list_columns");

  const handleViewOrientation = (
    _event: MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    setTab(newValue);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3,
        }}
      >
        <Typography variant="h3">Watch List</Typography>
        <ToggleButtonGroup
          value={tabs}
          exclusive
          onChange={handleViewOrientation}
        >
          <ToggleButton disableRipple value="watch_list_columns">
            <ViewWeekTwoToneIcon />
          </ToggleButton>
          <ToggleButton disableRipple value="watch_list_rows">
            <TableRowsTwoToneIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </>
  );
}

export default WatchList;
