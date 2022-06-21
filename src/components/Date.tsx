import { parseISO, format } from "date-fns";

type PropsType = {
  dateString: string
}

export default function Date(props: PropsType) {
  const date = parseISO(props.dateString);
  return (
    <time dateTime={props.dateString}>
      {format(date, 'LLLL d, yyyy')}
    </time>
  );
}