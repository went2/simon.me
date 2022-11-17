import projectsInfo from '../../local-database/projectInfo.json';
// const projectsInfo = require('../../local-database/projectInfo.json');

export interface IProjectInfo {
  icon?: string;
  name: string;
  desc: string;
  url: string;
}


export async function getProjectsInfo(): Promise<{ [key: string]: IProjectInfo[] }> {
  return new Promise((resolve) => {
    resolve(projectsInfo);
  })
}