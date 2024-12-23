import styled from "styled-components";
import Container from "../../../components/web/Container";
import { useCallback, useEffect, useRef, useState } from "react";
import { DayProps } from "../../mobile/schedule/Calendar";
import { DateRange } from "react-date-range";
import { ko } from "date-fns/locale";
import PrimaryButton from "../../../components/PrimaryButton";
import CustomInput from "../../../components/CustomInput";
import CitySlider from "../../../components/web/schedule/CitySlider";
import { useNavigate } from "react-router-dom";
import { createSchedule, getPlaceList } from "../../../service/axios";
import { CityProps } from "../../../types/schedule";
import { useDisplayStore } from "../../../store/display.store";
import CustomSkeleton from "../../../components/CustomSkeleton";
import { formatDateToString } from "./../../../utils/dateUtils";
import { toast } from "react-toastify";

export default function CreateSchedule() {
  const navigate = useNavigate();
  const { getCurrentCity } = useDisplayStore();
  const [city, setCity] = useState<CityProps[]>([]);
  const [date, setDate] = useState<DayProps[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [selectDate, setSelectDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectCity, setSelectCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageToken, setPageToken] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const [search, setSearch] = useState("");

  const filteredCities = () => {
    const filteredCities = city.filter((c) => c.name.includes(search));
    return filteredCities;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || !hasNextPage || getCurrentCity() !== "") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoading) {
            setPageToken((prev) => prev + 1);
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage]
  );

  const getCityApi = (page?: number) => {
    const cityType = getCurrentCity() !== "" ? getCurrentCity() : null;
    const cityCount = getCurrentCity() === "" ? 30 : 10;

    setIsLoading(true);
    if (page === 1) setCity([]);

    getPlaceList({
      type: "CITY",
      elementCnt: cityCount,
      cityType: cityType,
      page: page,
    }).then((res: any) => {
      if (res) {
        setCity((prev) => {
          if (page === 1) {
            return res?.data?.data;
          }
          const newCity = res?.data?.data?.filter(
            (n: any) => !prev.some((e) => e.placeId === n.placeId)
          );
          return [...prev, ...newCity];
        });
        setIsLoading(false);
        setHasNextPage(res?.data?.pageInfo.hasNext);
      }
    });
  };

  const handleSubmit = () => {
    if (!selectDate.startDate) {
      setSelectDate({
        startDate: date[0].startDate + "",
        endDate: date[0].endDate + "",
      });
    } else {
      const schedule = {
        startDate: formatDateToString(selectDate.startDate, true),
        endDate: formatDateToString(selectDate.endDate, true),
        placeId: selectCity,
      };
      createSchedule(schedule).then((res) => {
        if (res && res.status === 200) {
          toast(<span>일정이 생성되었습니다!</span>);
          navigate(`/home/schedule/details/${res.data}`);
        }
      });
    }
  };

  useEffect(() => {
    if (selectDate.startDate && !search) {
      setPageToken(1);
      getCityApi(1);
    }
  }, [selectDate.startDate]);

  useEffect(() => {
    if (!search) {
      getCityApi(1);
      setPageToken(1);
    }
  }, [getCurrentCity()]);

  useEffect(() => {
    if (pageToken > 1 && getCurrentCity() === "" && !search) {
      getCityApi(pageToken);
    }
  }, [pageToken, getCurrentCity()]);

  return (
    <Container>
      <h1>일정</h1>

      {!selectDate.startDate ? (
        <SelectDateBox>
          <h2>여행 날짜를 선택해주세요.</h2>

          <DateRange
            locale={ko}
            editableDateInputs={true}
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            months={2}
            direction="horizontal"
            onChange={(item) => setDate([item.selection] as DayProps[])}
            ranges={date as DayProps[]}
            rangeColors={["#e7e9fe"]}
          />
        </SelectDateBox>
      ) : (
        <SelectCityBox>
          <h2>어디로 떠나고 싶으신가요?</h2>

          <InputBox>
            <CustomInput
              width="500px"
              height="60px"
              text="도시를 선택해주세요."
              value={search}
              onChange={handleSearch}
            />
          </InputBox>

          <p>도시 선택</p>

          <CitySliderBox>
            <CitySlider />
          </CitySliderBox>

          <CityBox>
            {filteredCities()?.map((city) => (
              <City
                $isActive={selectCity === city.placeId}
                key={city.id}
                onClick={() => {
                  setSelectCity(city.placeId);
                }}
              >
                <span>{city.name}</span>
              </City>
            ))}

            {isLoading &&
              Array.from({ length: 1 }).map((_, idx) => (
                <CustomSkeleton
                  width="106px"
                  height="78px"
                  key={idx}
                  borderRadius="16px"
                />
              ))}
          </CityBox>
        </SelectCityBox>
      )}

      {selectDate.startDate && <div ref={lastElementRef} />}
      <ButtonBox>
        <PrimaryButton
          onClick={handleSubmit}
          blue={true}
          text="다음"
          width="190px"
        />
      </ButtonBox>
    </Container>
  );
}

const SelectDateBox = styled.div`
  margin-top: 40px;
  & > h2 {
    color: ${(props) => props.theme.color.gray900};
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 106px;
  }
`;

const SelectCityBox = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;

  & > h2 {
    margin: 0 auto;
    color: ${(props) => props.theme.color.gray900};
    font-size: 24px;
    font-weight: 700;
  }

  & > p {
    color: ${(props) => props.theme.color.gray900};
    font-size: 16px;
    font-weight: 700;
  }
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 24px 0 44px 0;
`;

const CitySliderBox = styled.div`
  margin-top: 24px;
`;

const CityBox = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  row-gap: 30px;
`;

const City = styled.div<{ $isActive: boolean }>`
  width: 106px;
  height: 78px;
  border-radius: 16px;
  border: 1px solid
    ${(props) =>
      props.$isActive
        ? props.theme.color.secondary
        : props.theme.color.gray200};
  background-color: ${(props) => props.theme.color.white};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & > span {
    color: ${(props) =>
      props.$isActive
        ? props.theme.color.secondary
        : props.theme.color.gray400};
  }
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 117px;
`;
