import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import { FaBars } from "react-icons/fa";
import { disconnect } from "../services/auth.js";

export default function Navigation({
  openModal,
  authentified,
  setAuthentified,
}) {
  return (
    <Menu
      className={"navigation"}
      menuButton={
        <MenuButton className={"navigation-btn"}>
          <FaBars />
        </MenuButton>
      }
    >
      {authentified ? (
        <>
          <MenuItem onClick={() => openModal("profil")}>Mon profil</MenuItem>
          <MenuItem
            onClick={async () => {
              try {
                setAuthentified(false);
                disconnect();
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Se déconnecter
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={() => openModal("connexion")}>
            Se connecter
          </MenuItem>
          <MenuItem onClick={() => openModal("inscription")}>
            S'inscrire
          </MenuItem>
        </>
      )}
    </Menu>
  );
}
