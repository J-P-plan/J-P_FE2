import styled from "styled-components";
import { scrollHidden } from "../../../assets/styles/home.style";
import { useLocation, useNavigate } from "react-router-dom";
import CustomInput from "../../../components/CustomInput";
import { NextButtonBox } from "./ScheduleLayout";
import { useDisplayStore } from "../../../store/display.store";
import { useEffect, useState } from "react";
import { getPlaceList } from "../../../service/axios";
import { CityProps } from "../../../types/schedule";
import CustomSkeleton from "../../../components/CustomSkeleton";

export default function SelectCity() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCurrentCity } = useDisplayStore();

  // 도시 목록
  const [city, setCity] = useState<CityProps[]>([]);

  // 선택한 도시
  const [selectCity, setSelectCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 선택한 여행 날짜
  console.log(location?.state?.date[0]);

  useEffect(() => {
    const cityType = getCurrentCity() !== "" ? getCurrentCity() : null;
    const cityCount = getCurrentCity() === "" ? 30 : 10;
    setIsLoading(true);

    getPlaceList({
      type: "CITY",
      elementCnt: cityCount,
      cityType: cityType,
    }).then((res) => {
      if (res) {
        setCity(res?.data.data);
        setIsLoading(false);
      }
    });
  }, [getCurrentCity()]);

  return (
    <>
      <CustomInput text="어디로 떠나고 싶나요?" value="" />

      <SelectCityText>도시 선택</SelectCityText>

      <CityRow>
        <City $isSelect={true}>
          <span>전체</span>
        </City>
        <City $isSelect={false}>
          <span>서울</span>
        </City>
        <City $isSelect={false}>
          <span>경기</span>
        </City>
        <City $isSelect={false}>
          <span>서울</span>
        </City>
        <City $isSelect={false}>
          <span>경기</span>
        </City>
        <City $isSelect={false}>
          <span>서울</span>
        </City>
        <City $isSelect={false}>
          <span>경기</span>
        </City>
        <City $isSelect={false}>
          <span>서울</span>
        </City>
        <City $isSelect={false}>
          <span>경기</span>
        </City>
      </CityRow>

      <CityGridBox>
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <CustomSkeleton
                key={idx}
                width="100px"
                height="64px"
                borderRadius="16px"
              />
            ))
          : city?.map((city) => (
              <CityGrid
                key={city.id}
                $isActive={selectCity === city.placeId}
                onClick={() => setSelectCity(city.placeId)}
              >
                {city.name}
              </CityGrid>
            ))}
      </CityGridBox>

      <NextButtonBox>
        <button onClick={() => navigate("/Schedule/details")}>다음</button>
      </NextButtonBox>
    </>
  );
}

const SelectCityText = styled.p`
  color: ${(props) => props.theme.color.gray900};
  font-size: 16px;
  font-weight: 700;
  margin: 14px 0;
`;

const CityRow = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  overflow-x: auto;
  ${scrollHidden};
  margin-bottom: 20px;
`;

const City = styled.div<{ $isSelect: boolean }>`
  padding: 6px 12px;
  background-color: ${(props) =>
    props.$isSelect
      ? props.theme.color.secondary
      : props.theme.color.background};
  border: 1px solid ${(props) => props.theme.color.secondary};
  border-radius: 16px;

  & > span {
    color: ${(props) =>
      props.$isSelect ? props.theme.color.white : props.theme.color.secondary};
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }
`;

const CityGridBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 9px;
  gap: 9px;
  height: calc(100% - 45px - 44px - 52px);
  overflow-y: auto;
  ${scrollHidden};
  align-content: flex-start;
  flex: 1;
`;

const CityGrid = styled.div<{ $isActive: boolean }>`
  padding: 24px 30px;
  max-height: 66px;
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(props) =>
    props.$isActive ? props.theme.color.secondary : props.theme.color.gray400};
  font-size: 14px;
  font-weight: 400;
  border-radius: 16px;
  border: 1px solid
    ${(props) =>
      props.$isActive
        ? props.theme.color.secondary
        : props.theme.color.gray200};
`;
