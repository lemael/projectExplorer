import { AccountCircle, Home, PostAdd, Settings } from "@mui/icons-material";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

interface SidebarMenuProps {
  // activePage doit être l'un des chemins définis
  activePage: string;

  // onNavigate est une fonction qui prend un chemin et ne retourne rien
  onNavigate: (pageName: string) => void;
}
const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activePage,
  onNavigate,
}) => {
  const menuItems = [
    { name: "home", text: "Home", icon: Home, path: "dashboards" }, // Ceci est le bouton que nous allons regarder
    {
      name: "cardEditor",
      text: "Card Editor",
      icon: PostAdd,
      path: "dashboards/cardEditor",
    },
    {
      name: "settings",
      text: "Paramètres",
      icon: Settings,
      path: "dashboards/settings",
    },
    {
      name: "profile",
      text: "Profil",
      icon: AccountCircle,
      path: "dashboards/profile",
    },
  ];
  return (
    <List
      component="nav"
      sx={
        {
          /* ... */
        }
      }
    >
      {menuItems.map((item) => (
        <ListItemButton
          key={item.name}
          // Si on clique sur 'home', la fonction onNavigate('home') est appelée.
          onClick={() => onNavigate(item.path)}
          selected={activePage === item.path}
        >
          <ListItemIcon>
            <item.icon />
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default SidebarMenu;
