/**
 * Navbar data
 */
import navData from "../config/navData.json";

type INavItem = {
  name: string;
  path: string;
};

export const navList: INavItem[] = navData;
