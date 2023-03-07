import projects from "../../local-data/projectInfo.json";

export interface IProjectInfo {
  icon?: string;
  name: string;
  desc: string;
  url: string;
  cover: string;
  updateAt: string;
  tags: string[];
}

export async function getProjectsInfo(): Promise<{
  items: IProjectInfo[];
  description: string;
}> {
  return new Promise((resolve) => {
    projects.expriments.items = projects.expriments.items.sort(
      (a, b) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime()
    );
    resolve(projects.expriments);
  });
}
