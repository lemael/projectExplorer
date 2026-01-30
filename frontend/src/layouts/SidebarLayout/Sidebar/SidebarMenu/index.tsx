import {
  AccountCircle,
  Assignment,
  ExpandLess,
  ExpandMore,
  Home,
  Inventory,
  Layers,
  LocalShipping,
  Payments,
  Settings,
} from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";

interface SidebarMenuProps {
  activePage: string;
  onNavigate: (pageName: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activePage,
  onNavigate,
}) => {
  const [openPages, setOpenPages] = useState(false);
  const [openFormular, setOpenFormular] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const menuItems = [
    { name: "home", text: "Home", icon: Home, path: "dashboards" },

    {
      name: "pages",
      text: "Seiten",
      icon: Layers,
      path: null,
      isOpen: openPages,
      toggle: () => setOpenPages(!openPages),
      children: [
        { name: "page1", text: "Unterseite 1", path: "dashboards/page1" },
        { name: "page2", text: "Unterseite 2", path: "dashboards/page2" },
      ],
    },
    {
      name: "produkten",
      text: "Produkten",
      icon: Inventory,
      path: null,
      isOpen: openMenus.produkten,
      toggle: () =>
        setOpenMenus({ ...openMenus, produkten: !openMenus.produkten }),
      children: [
        {
          name: "allProducts",
          text: "Alle Produkten",
          path: "dashboards/allProducts",
        },
        {
          name: "addProductName",
          text: "Produkt hinzufügen",
          path: "dashboards/addProduct",
        },
      ],
    },
    {
      name: "formularen",
      text: "Formularen",
      icon: Assignment,
      path: null,
      isOpen: openFormular,
      toggle: () => setOpenFormular(!openFormular),
      children: [
        {
          name: "charProdukt",
          text: "Produkteigenschaft",
          path: "dashboards/produkteigenschaft",
        },
        {
          name: "payForm",
          text: "Zahlungformular",
          path: "dashboards/zahlungformular",
        },
      ],
    },
    {
      name: "payment",
      text: "Zahlungsmethode",
      icon: Payments,
      path: "dashboards/payment",
    },
    {
      name: "shipping",
      text: "Servicepaketsendung",
      icon: LocalShipping,
      path: "dashboards/shipping",
    },
    {
      name: "settings",
      text: "Einstellungen",
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
    <List component="nav">
      {menuItems.map((item) => {
        if (item.children) {
          return (
            <React.Fragment key={item.name}>
              {/* Utilise BIEN item.toggle ici */}
              <ListItemButton onClick={item.toggle}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.isOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.name}
                      sx={{ pl: 4 }}
                      selected={activePage === child.path}
                      onClick={() => onNavigate(child.path)}
                    >
                      <ListItemText primary={child.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        }

        return (
          <ListItemButton
            key={item.name}
            onClick={() => item.path && onNavigate(item.path)}
            selected={activePage === item.path}
          >
            <ListItemIcon>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default SidebarMenu;
