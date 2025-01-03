import styled from "styled-components";
import ImageView from "../ImageView";
import StarIcon from "../../../assets/icons/StarIcon";
import AlarmIcon from "../../../assets/icons/AlarmIcon";
import InfoIcon from "../../../assets/icons/InfoIcon";
import MarkIcon from "../../../assets/icons/MarkIcon";
import CustomSkeleton from "../../CustomSkeleton";
import useImgLoading from "../../../hooks/useImgLoading";
import { useModalStore } from "../../../store/modal.store";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";
import { SelectPlaceProps } from "../../../types/place";

interface Props {
  data: SelectPlaceProps;
}

const cookies = new Cookies();

export default function InfoModal({ data }: Props) {
  const { loading } = useImgLoading({ imgSrc: data?.photoUrls[0] });
  const modalStore = useModalStore();

  const handleClick = () => {
    if (!cookies.get("userToken")) {
      return toast(<span>로그인이 필요합니다.</span>);
    }

    modalStore.setCurrentModal("addPlan");
  };

  return (
    <>
      <ModalTopBox>
        {loading ? (
          <CustomSkeleton width="160px" height="145px" borderRadius="16px" />
        ) : (
          <ImageView
            src={data?.photoUrls[0]}
            alt="이미지없음"
            width="160px"
            height="145px"
          />
        )}
        <div>
          <h1>{data.name}</h1>
          <p>{data.shortAddress}</p>
          <span>
            <StarIcon />
            {data.rating}
          </span>
        </div>
        <ModalAddButton onClick={handleClick}>
          <span>+ 여행지 추가</span>
        </ModalAddButton>
      </ModalTopBox>
      <ModalBottomBox>
        <span>
          <AlarmIcon /> {data.businessStatus}
        </span>
        <span>
          <InfoIcon />{" "}
          {!data.formattedPhoneNumber
            ? "전화번호 없음"
            : data.formattedPhoneNumber}
        </span>
        <span>
          <MarkIcon width="18" height="18" /> {data.fullAddress}
        </span>
      </ModalBottomBox>
    </>
  );
}

const ModalTopBox = styled.div`
  height: 145px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 22px;
  position: relative;
  & > div {
    display: flex;
    flex-direction: column;
    gap: 15px;
    & > h1 {
      color: ${(props) => props.theme.color.gray900};
      font-size: 24px;
      font-weight: 700;
    }
    & > p {
      color: ${(props) => props.theme.color.gray700};
      font-size: 16px;
    }
    & > span {
      color: ${(props) => props.theme.color.gray700};
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
  }
`;

const ModalAddButton = styled.button`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 120px;
  height: 44px;
  border-radius: 30px;
  border: 1px solid ${(props) => props.theme.color.main};
  background-color: ${(props) => props.theme.color.main};
  display: flex;
  justify-content: center;
  align-items: center;
  & > span {
    color: ${(props) => props.theme.color.white};
    font-size: 14px;
    font-weight: 700;
  }
`;

const ModalBottomBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > span {
    display: flex;
    align-items: center;
    gap: 9px;
    color: ${(props) => props.theme.color.gray700};
    font-size: 16px;
  }
`;
