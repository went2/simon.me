/**
 * navbar data
 */
import navData from "../../local-data/navData.json";

type INavItem = {
  name: string;
  path: string;
};

export const navList: INavItem[] = navData;
