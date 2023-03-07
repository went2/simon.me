/**
 * navbar data
 */
import navData from "../../local-file/navData.json";

type INavItem = {
  name: string;
  path: string;
};

export const navList: INavItem[] = navData;
