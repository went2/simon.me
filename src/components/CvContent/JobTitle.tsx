type Props = {
  children: string | JSX.Element;
}

const JobTitle = ({ children }: Props) => {
  return (
    <>
      <p><strong>{children}</strong></p>
      <style jsx>
        {`
        strong {
          font-size: 22px;
          line-height: 2.5rem;
        }
        
        `}
      </style>
    </>
  );
};

export default JobTitle;