interface Props {
  fill?: string;
  stroke?: string;
}

const ProfileIcon = ({ fill = "none", stroke = "#4D4D4D" }: Props) => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.89999 20.5124C2.89999 16.7369 6.05428 13.6762 12.5 13.6762C18.9457 13.6762 22.1 16.7369 22.1 20.5124C22.1 21.1131 21.6618 21.6 21.1212 21.6H3.87882C3.33823 21.6 2.89999 21.1131 2.89999 20.5124Z"
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d="M16.1 5.99999C16.1 7.98822 14.4882 9.59999 12.5 9.59999C10.5118 9.59999 8.89999 7.98822 8.89999 5.99999C8.89999 4.01177 10.5118 2.39999 12.5 2.39999C14.4882 2.39999 16.1 4.01177 16.1 5.99999Z"
        stroke={stroke}
        strokeWidth="2"
      />
    </svg>
  );
};

export default ProfileIcon;
