
type AboutPropsType = {
  fileData: { htmlContent: string };
};

export default function About({fileData}: AboutPropsType) {
  const { htmlContent } = fileData;
  return (
    <main className="mdContainer">
      <div dangerouslySetInnerHTML={{ __html: htmlContent as string }} />
    </main>
  );
}