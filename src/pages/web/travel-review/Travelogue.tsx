import { useEffect, useState } from "react";
import { testReviewItem } from "../../../utils/staticDatas";
import styled from "styled-components";
import TravelogueCard from "../../../components/web/travel-review/TravelogueCard";
import { ReviewProps, TravelogProps } from "../../../types/travelreview";
import LoadingText from "../../../components/LoadingText";
import { getAllDiaries } from "../../../service/axios";

interface Props {
  sort: string;
}

export default function Travelogue({ sort }: Props) {
  const [data, setData] = useState<TravelogProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleMoreClick = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const requestApi = async () => {
    setIsLoading(true);

    await getAllDiaries(page, sort).then((res) => {
      setData(res?.data.data);
      setHasMore(res?.data.data.length > 0);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    requestApi();
  }, [page, sort]);

  return (
    <>
      {isLoading && <LoadingText text="로딩중..." />}
      {!isLoading && data.length === 0 && (
        <LoadingText text="첫 여행기를 작성해주세요!" />
      )}
      {!isLoading && (
        <TravelogueContainer>
          {data.map((item, i) => {
            return <TravelogueCard key={i} item={item} />;
          })}
          {hasMore && <MoreButton onClick={handleMoreClick}>더보기</MoreButton>}
        </TravelogueContainer>
      )}
    </>
  );
}

const TravelogueContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const MoreButton = styled.button`
  font-weight: 700;
  padding: 14px 44px;
  background-color: ${(props) => props.theme.color.white};
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.color.gray200};

  &:active {
    background-color: ${(props) => props.theme.color.gray200};
  }
`;
