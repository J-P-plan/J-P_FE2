interface Props {
  fill?: string;
  stroke?: string;
  height?: string;
  width?: string;
}

const NoteIcon = ({
  fill = "none",
  stroke = "#1a1a1a",
  width = "18",
  height = "18",
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 19"
      fill={fill}
    >
      <path
        d="M7.16758 16.668H3.56757C2.57346 16.668 1.76757 15.8621 1.76758 14.868L1.76765 4.06806C1.76765 3.07395 2.57354 2.26807 3.56765 2.26807H11.6678C12.662 2.26807 13.4679 3.07395 13.4679 4.06807V7.66807M4.91786 5.86807H10.3179M4.91786 8.56807H10.3179M4.91786 11.2681H7.61786M9.86772 14.1863L13.6861 10.368L16.2317 12.9135L12.4133 16.7319H9.86772V14.1863Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NoteIcon;
