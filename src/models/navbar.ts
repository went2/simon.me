/**
 * navbar data
*/
import navData from  '../../local-database/navData.json';

type INavItem = {
  name: string;
  path: string;
}

export const navList: INavItem[] = navData;
