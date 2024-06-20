
import PageContent from './pageContent';

import { getFileContentByName } from "../../utils/processFile";

export default async function AboutPage() {
  const fileData = await getFileContentByName("docs", "about");

  return (
    <PageContent fileData={fileData}></PageContent>
  )
}