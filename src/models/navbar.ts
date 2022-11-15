/**
 * navbar data
*/

type INavItem = {
  name: string;
  path: string;
  icon?: string; // font awesome class name
}

export const navList: INavItem[] = [
  { name: '/ 项目', path: '/projects', icon: 'fa fa-product-hunt' },
  { name: '/ 文章', path: '/posts', icon: 'fa fa-book' },
  { name: '/ 关于我', path: '/about', icon: 'fa fa-at' },
];
