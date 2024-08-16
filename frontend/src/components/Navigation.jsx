import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import { FaBars } from "react-icons/fa";

export default function Navigation({ openModal }) {
  return (
    <Menu
      className={"navigation"}
      menuButton={
        <MenuButton className={"navigation-btn"}>
          <FaBars />
        </MenuButton>
      }
    >
      <MenuItem onClick={() => openModal("connexion")}>Se connecter</MenuItem>
      <MenuItem onClick={() => openModal("inscription")}>S'inscrire</MenuItem>
      <MenuItem>Mes Pokémons</MenuItem>
    </Menu>
  );
}
