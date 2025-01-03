import Slider from "react-slick";
import styled from "styled-components";
import { DayProps } from "../types/schedule";
import { dayOfWeek } from "../utils/staticDatas";
import NextArrow from "./mobile/schedule/NextArrow";
import PrevArrow from "./mobile/schedule/PrevArrow";

interface Props {
  isMobile: boolean;
  dayResDtos: DayProps[];
  selectDay: number;
  setSelectDay: (id: number) => void;
}

export default function MoveDaySlider({
  isMobile,
  dayResDtos,
  selectDay,
  setSelectDay,
}: Props) {
  const slideSettings = {
    infinite: false,
    focusOnSelect: true,
    focusOnChange: true,
    slidesToShow: dayResDtos.length < 3 ? dayResDtos.length : 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    speed: 500,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <StyledSlider {...slideSettings} $isMobile={isMobile}>
      {dayResDtos.map((day, i) => {
        const date = new Date(day.date);
        const week = dayOfWeek.find((item) => item.id === day.dayOfWeek);
        return (
          <div key={i}>
            <DayBox
              key={i}
              onClick={() => setSelectDay(day.id)}
              $select={selectDay === day.id}
              $isMobile={isMobile}
            >
              <p>{`Day ${day.dayIndex}`}</p>
              <span>
                {`${date.getMonth() + 1}.${date.getDate()} (${week?.name})`}
              </span>
            </DayBox>
          </div>
        );
      })}
    </StyledSlider>
  );
}

const StyledSlider = styled(Slider)<{ $isMobile: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "0 6px" : "32px 15px")};
  text-align: center;
  display: flex;

  .slick-list {
    width: 100%;
  }
  .slick-slide {
    display: flex;
    justify-content: center;
  }
`;

const DayBox = styled.div<{ $select: boolean; $isMobile: boolean }>`
  height: ${({ $isMobile }) => ($isMobile ? "61px" : "78px")};
  width: ${({ $isMobile }) => $isMobile && "75px"};
  padding: ${({ $isMobile }) => ($isMobile ? "10px" : "16px 20px")};
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  background-color: ${(props) => props.theme.color.white};

  border: 1px solid
    ${(props) =>
      props.$select ? props.theme.color.secondary : props.theme.color.gray200};
  border-radius: 12px;
  font-size: ${({ $isMobile }) => $isMobile && "14px"};

  & > p {
    font-weight: 700;
    color: ${(props) =>
      props.$select ? props.theme.color.secondary : props.theme.color.gray700};
  }
  & > span {
    color: ${(props) =>
      props.$select ? props.theme.color.secondary : props.theme.color.gray400};
  }

  cursor: pointer;
`;
