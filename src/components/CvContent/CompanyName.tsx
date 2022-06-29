type Props = {
  children: string | JSX.Element;
};

const CompanyName = ({ children }: Props) => {
  return (
    <>
      <span>{children}</span>
      <style jsx>
        {`
        span {
          font-size: 16px;
          line-height: 1.4rem;
          color: var(--text-secondary);
          padding: 2px 0;
        }
        span:hover {
          border-bottom: 1px dashed #bbb;
        }
        
        `}
      </style>
    </>
  );
};

export default CompanyName;