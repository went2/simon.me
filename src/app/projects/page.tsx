import PageContent from './pageContent';

import { getProjectsInfo } from "../../models/projects";

export default async function ProjectsPage() {
  const projects = await getProjectsInfo();
  return (
    <PageContent projects={projects} />
  )
}