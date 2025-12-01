import { Avatar, ListItemAvatar, styled, useTheme } from "@mui/material";

// --- Définitions de style (Styling Definitions) ---

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      /* Styles de l'avatar vide */
`
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  /* Styles de l'avatar de la liste vide */
`
);

// --- Composant Principal (Main Component) ---

function AccountBalance() {
  const theme = useTheme();

  const data = [
    { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Mär", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Mai", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
  ];

  return <div>AccountBalance</div>;
}

export default AccountBalance;
