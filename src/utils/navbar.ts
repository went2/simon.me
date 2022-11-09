/**
 * navbar data
*/

export interface INavItem {
  name: string;
  path: string;
  icon?: string; // font awesome class name
}

const navList: INavItem[] = [
  { name: '首页', path: '/', icon: 'fa fa-home' },
  { name: '文章', path: '/articles', icon: 'fa fa-book' },
  { name: '项目', path: '/projects', icon: 'fa fa-product-hunt' },
  { name: 'cv', path: '/cv', icon: 'fa fa-at' },
];

export function getNavList() {
  return new Promise((resolve) => {
    resolve(navList);
  })
}