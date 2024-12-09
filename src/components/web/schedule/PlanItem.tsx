import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import styled from "styled-components";
import AlarmIcon from "../../../assets/icons/AlarmIcon";
import FileCheckIcon from "../../../assets/icons/FileCheckIcon";
import PhoneIcon from "../../../assets/icons/PhoneIcon";
import StarIcon from "../../../assets/icons/StarIcon";
import TicketIcon from "../../../assets/icons/TicketIcon";
import TrashIcon from "../../../assets/icons/TrashIcon";
import {
  deletePlaceFromSchedule,
  getGooglePlaceDetail,
  moveScheduleDate,
} from "../../../service/axios";
import { useCurrentDayIdStore } from "../../../store/currentDayId.store";
import { useAddPlaceStore } from "../../../store/useAddPlace.store";
import { useUserStore } from "../../../store/user.store";
import { SelectPlaceProps } from "../../../types/place";
import { DayLocationProps, DayProps } from "../../../types/schedule";
import CustomSkeleton from "../../CustomSkeleton";
import IconBox from "../../IconBox";
import MoveDaySlider from "../../MoveDaySlider";
import OneButtonModal from "../../OneButtonModal";
import TimeSwiper from "../../TimeSwiper";
import TwoButtonsModal from "../../TwoButtonsModal";
import ImageView from "../ImageView";
import NoButtonModal from "../NoButtonModal";
import PlanMemo from "./PlanMemo";

interface Props {
  item: DayLocationProps;
  isEdit: boolean;
  dayList: DayProps[];
  reloadSchedule: () => Promise<void>;
}

export default function PlanItem({
  item,
  isEdit,
  dayList,
  reloadSchedule,
}: Props) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState({
    delete: false,
    deleteSuccess: false,
  });
  const [isOpenMemoModal, setIsOpenMemoModal] = useState({
    memo: false,
    cost: false,
  });
  const [isOpenPlaceModal, setIsOpenPlaceModal] = useState(false);
  const [isMove, setIsMove] = useState(false);
  const [placeInfo, setPlaceInfo] = useState<SelectPlaceProps>();
  const [isLoading, setIsLoading] = useState(false);
  const { getUserType } = useUserStore();
  const { getCurrentDayId } = useCurrentDayIdStore();
  const { selectDay, selectTime, openModal, setOpenModal } = useAddPlaceStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const handleItemClick = async () => {
    if (isEdit) {
      setIsMove(true);
      setOpenModal({ selectDay: true });
    } else {
      setIsLoading(true);
      setIsOpenPlaceModal(true);
      await getGooglePlaceDetail({ placeId: item.placeId }).then((res) => {
        setPlaceInfo(res!.data);
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  const handleMovePlanClick = async () => {
    setOpenModal({ selectTime: false });
    if (isMove) {
      setIsMove(false);
      await moveScheduleDate(
        item.id,
        {
          newDayId: selectDay,
          time: selectTime,
        },
        getUserType()
      ).then(() => {
        reloadSchedule();
      });
    } else {
      await moveScheduleDate(
        item.id,
        {
          newDayId: getCurrentDayId()!,
          time: selectTime,
        },
        getUserType()
      ).then(() => {
        reloadSchedule();
      });
    }
  };

  const handleEditTimeClick = async () => {
    if (isEdit) {
      setOpenModal({ selectTime: true });
    }
  };

  const handleDeleteItemClick = async () => {
    await deletePlaceFromSchedule(item.id).then(() => {
      setIsOpenDeleteModal({ delete: false, deleteSuccess: true });
      reloadSchedule();
    });
  };

  return (
    <>
      <PlanItemContainer
        ref={setNodeRef}
        {...attributes}
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition,
          zIndex: isDragging ? "100" : "auto",
        }}
      >
        <TimeBox
          $isEdit={isEdit}
          onClick={handleEditTimeClick}
        >{`${item.time}`}</TimeBox>
        <PlaceBox $isDragging={isDragging} onClick={handleItemClick}>
          <PlaceNum $isEdit={isEdit}>{item.index}</PlaceNum>
          <PlaceTitleBox>
            <p>{item.name}</p>
            <span>명소</span>
          </PlaceTitleBox>
          {isEdit && (
            <DragHandler
              ref={setActivatorNodeRef}
              {...listeners}
              $isDragging={isDragging}
            >
              선택
            </DragHandler>
          )}
        </PlaceBox>
        {isEdit ? (
          <button
            onClick={() =>
              setIsOpenDeleteModal({
                delete: true,
                deleteSuccess: false,
              })
            }
          >
            <TrashIcon />
          </button>
        ) : (
          <MemoButton
            onClick={() => setIsOpenMemoModal((p) => ({ ...p, memo: true }))}
          >
            <FileCheckIcon />
          </MemoButton>
        )}
      </PlanItemContainer>

      {/* 일정 장소 상세 Modal */}
      {isOpenPlaceModal && placeInfo && (
        <NoButtonModal
          width="470px"
          height="390px"
          onClose={() => setIsOpenPlaceModal(false)}
        >
          <>
            <ModalTopBox>
              {isLoading ? (
                <CustomSkeleton
                  width="130px"
                  height="110px"
                  borderRadius="16px"
                />
              ) : (
                <ImageView
                  src={placeInfo?.photoUrls[0]}
                  alt={placeInfo.name}
                  width="130px"
                  height="110px"
                />
              )}
              <div>
                <h1>{placeInfo.name}</h1>
                <span>{placeInfo.shortAddress}</span>
                <IconBox>
                  <StarIcon />
                  <span>{placeInfo.rating}</span>
                </IconBox>
              </div>
            </ModalTopBox>
            <ModalBottomBox>
              <PlaceInfoBox>
                <div>
                  <AlarmIcon />
                  <PlaceWeekdayBox>
                    {placeInfo.weekdayText.map((weekday, idx) => {
                      return <span key={idx}>{weekday}</span>;
                    })}
                  </PlaceWeekdayBox>
                </div>
                <div>
                  <TicketIcon />
                  <span>스카이워크 3,000</span>
                </div>
                <div>
                  <PhoneIcon />
                  <span>{placeInfo.formattedPhoneNumber}</span>
                </div>
              </PlaceInfoBox>
            </ModalBottomBox>
          </>
        </NoButtonModal>
      )}

      {/* 일정 이동 Modal */}
      {openModal.selectDay && (
        <OneButtonModal
          isMobile={false}
          width="470px"
          height="390px"
          title="다른 날로 이동"
          buttonText="다음"
          onClick={() => setOpenModal({ selectDay: false, selectTime: true })}
          onClose={() => setOpenModal({ selectDay: false })}
        >
          <MoveDaySlider isMobile={false} dayResDtos={dayList} />
        </OneButtonModal>
      )}
      {openModal.selectTime && (
        <OneButtonModal
          isMobile={false}
          width="470px"
          height="390px"
          title="시간 설정"
          buttonText="완료"
          onClick={handleMovePlanClick}
          onClose={() => setOpenModal({ selectTime: false })}
        >
          <TimeSwiper isMobile={false} />
        </OneButtonModal>
      )}

      {/* 일정 삭제 Modal */}
      {isOpenDeleteModal.delete && (
        <TwoButtonsModal
          isMobile={false}
          width="470px"
          height="390px"
          text="일정을 삭제할까요?"
          onClick={handleDeleteItemClick}
          onClose={() => setIsOpenDeleteModal((p) => ({ ...p, delete: false }))}
        />
      )}
      {isOpenDeleteModal.deleteSuccess && (
        <OneButtonModal
          isMobile={false}
          width="470px"
          height="390px"
          noCloseBtn
          buttonText="확인"
          onClick={() =>
            setIsOpenDeleteModal((p) => ({ ...p, deleteSuccess: false }))
          }
        >
          <ModalText>일정이 삭제되었습니다.</ModalText>
        </OneButtonModal>
      )}

      {/* 일정 - 나의 플랜 Modal */}
      {isOpenMemoModal.memo && (
        <NoButtonModal
          width="666px"
          height="808px"
          onClose={() => setIsOpenMemoModal((p) => ({ ...p, memo: false }))}
          noCloseBtn
        >
          <PlanMemo
            isAddCost={false}
            planItemId={item.id}
            setIsOpenMemoModal={setIsOpenMemoModal}
          />
        </NoButtonModal>
      )}

      {/* 일정 - 비용 추가 Modal */}
      {isOpenMemoModal.cost && (
        <NoButtonModal
          width="666px"
          height="695px"
          onClose={() => setIsOpenMemoModal((p) => ({ ...p, memo: false }))}
          noCloseBtn
        >
          <PlanMemo
            isAddCost={true}
            planItemId={item.id}
            setIsOpenMemoModal={setIsOpenMemoModal}
          />
        </NoButtonModal>
      )}
    </>
  );
}

const PlanItemContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 65px;
`;

const TimeBox = styled.div<{ $isEdit: boolean }>`
  width: 48px;
  height: 33px;
  padding: 8px;
  display: grid;
  place-content: center;
  border-radius: 12px;
  background-color: ${(props) =>
    props.$isEdit
      ? props.theme.color.gray100
      : props.theme.color.secondaryLight};
  font-size: 14px;
  cursor: pointer;
`;

const PlaceBox = styled.div<{ $isDragging: boolean }>`
  width: 100%;
  height: 75px;
  display: flex;
  align-items: center;
  padding: 17px 24px;
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid
    ${(props) =>
      props.$isDragging
        ? props.theme.color.secondary
        : props.theme.color.gray200};
  border-radius: 16px;
  gap: 16px;
  cursor: pointer;
`;

const PlaceNum = styled.div<{ $isEdit: boolean }>`
  width: 28px;
  height: 28px;
  padding: 5px 10px;
  display: grid;
  place-content: center;
  border-radius: 50px;
  background-color: ${(props) =>
    props.$isEdit ? props.theme.color.gray100 : props.theme.color.pointCoral};
  color: ${(props) =>
    props.$isEdit ? props.theme.color.gray400 : props.theme.color.white};
  font-weight: 700;
  font-size: 12px;
`;

const PlaceTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  gap: 6px;
  margin-right: auto;

  & > p {
    font-weight: 700;
    color: ${(props) => props.theme.color.gray900};
    margin-top: 2px;
  }

  & > span {
    font-size: 12px;
    color: ${(props) => props.theme.color.gray400};
  }
`;

const DragHandler = styled.div<{ $isDragging: boolean }>`
  color: ${(props) =>
    props.$isDragging
      ? props.theme.color.secondary
      : props.theme.color.gray300};
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
`;

const MemoButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 8px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.secondary};
`;

const ModalText = styled.p`
  font-size: 20px;
  font-weight: 700;
`;

const ModalTopBox = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 0 20px;
  gap: 28px;

  & > div {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
  }
`;

const ModalBottomBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  justify-content: center;
  padding: 36px;
`;

const PlaceInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  & > div {
    display: flex;
    gap: 10px;
    color: ${(props) => props.theme.color.gray700};
  }
`;

const PlaceWeekdayBox = styled.div`
  display: flex;
  flex-direction: column;
`
