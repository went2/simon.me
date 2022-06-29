type Props = {
  children: string | JSX.Element;
};

const WorkingYear = ({ children }: Props) => {
  return (
    <>
      <p>{children}</p>
      <style jsx>
        {`
        p {
          font-size: 16px;
          margin: 3px auto;
          line-height: 1.4rem;
          color: var(--text-primary);
          padding: 2px 0;
          letter-spacing: 0.5px;
        }
        
        `}
      </style>
    </>
  );
};

export default WorkingYear;