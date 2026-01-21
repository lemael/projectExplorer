import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(["color", "fill"])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`,
);

function HeaderMenu() {
  // ✅ Les blocs d'accolades inutiles ont été supprimés ici

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            xs: "flex",
            md: "block",
          },
        }}
      >
        <List disablePadding component={Box} display="flex">
          <ListItemButton
            classes={{ root: "MuiListItem-indicators" }}
            component={NavLink}
            to="/dashboards/overview"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Overview"
            />
          </ListItemButton>
        </List>
      </ListWrapper>
      {/* Le reste du code commenté a été déplacé ici ou supprimé 
          pour éviter les erreurs de syntaxe dans le JSX 
      */}
    </>
  );
}

export default HeaderMenu;
