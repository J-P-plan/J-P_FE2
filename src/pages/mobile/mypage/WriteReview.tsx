import styled from "styled-components";
import CustomHeader from "../../../components/mobile/CustomHeader";
import MarkIcon from "../../../assets/icons/MarkIcon";
import ActionButton from "../../../components/ActionButton";
import StarIcon from "../../../assets/icons/StarIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { useWriteReviewStore } from "../../../store/writeReview.store";
import PlusIcon from "../../../assets/icons/PlusIcon";
import ImageAddIcon from "../../../assets/icons/ImageAddIcon";
import XIcon from "../../../assets/icons/XIcon";
import { useEffect, useRef, useState } from "react";
import useImagesUploadHook from "../../../hooks/useImagesUpload";
import OneButtonModal from "../../../components/OneButtonModal";
import {
  createReview,
  getReviewDetail,
  updateReview,
  uploadFiles,
} from "../../../service/axios";

export default function WriteReview() {
  const [openModal, setOpenModal] = useState(false);

  const handlePrev = () => {
    navigate(-1);
    writeReviewStore.clear();
  };

  const handleClose = () => {
    handlePrev();
    setOpenModal(false);
  };
  const {
    imageRef,
    images,
    handleImageChange,
    handleButtonClick,
    handleImageDelete,
  } = useImagesUploadHook();
  const navigate = useNavigate();
  const writeReviewStore = useWriteReviewStore();

  const [form, setForm] = useState({
    content: "",
    imgs: [],
  });

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (images.length !== 0 && contentRef.current) {
      uploadFiles(images, "REVIEW").then((res) => {
        if (res) {
          if (isEdit) {
            const body = {
              subject: writeReviewStore.getSelectedPlace(),
              content: contentRef?.current?.value,
              placeId: writeReviewStore.getSelectedPlaceId(),
              star: writeReviewStore.getStar(),
              newFileIds: res.data.data.map((file: any) => file.fileId),
            };

            updateReview(body, isEdit).then((res) => {
              if (res?.status === 200) setOpenModal(true);
            });
          } else {
            const body = {
              subject: writeReviewStore.getSelectedPlace(),
              content: contentRef?.current?.value,
              placeId: writeReviewStore.getSelectedPlaceId(),
              star: writeReviewStore.getStar(),
              fileIds: res.data.data.map((file: any) => file.fileId),
            };

            createReview(body).then((res) => {
              if (res?.status === 200) setOpenModal(true);
            });
          }
        }
      });
    } else {
      const body = {
        subject: writeReviewStore.getSelectedPlace(),
        content: contentRef?.current?.value,
        placeId: writeReviewStore.getSelectedPlaceId(),
        star: writeReviewStore.getStar(),
      };

      if (isEdit) {
        updateReview(body, isEdit).then((res) => {
          if (res?.status === 200) setOpenModal(true);
        });
      } else {
        createReview(body).then((res) => {
          if (res?.status === 200) setOpenModal(true);
        });
      }
    }
  };

  const location = useLocation();
  const isEdit = location.state && location.state.reviewId;
  useEffect(() => {
    if (isEdit) {
      getReviewDetail(isEdit).then((res) => {
        if (res) {
          writeReviewStore.setSelectedPlace(res?.data.subject);
          writeReviewStore.setSelectedPlaceId(res?.data.placeId);
          writeReviewStore.setStar(res?.data.star);
          setForm((p) => ({
            ...p,
            star: res?.data.star,
            content: res?.data.content,
            imgs: res?.data.fileInfos,
          }));
        }
      });
    }
  }, []);

  return (
    <>
      <CustomHeader handleClick={handlePrev} title="리뷰 작성">
        {/* TODO: 완료 시에 검증이 필요하면 추가하기*/}
        <HeaderText onClick={handleSubmit}>완료</HeaderText>
      </CustomHeader>

      <WriteReviewBody>
        <MarkerBox>
          <Marker $isActive={!!writeReviewStore.getSelectedPlace()}>
            <MarkIcon width="20" height="20" stroke="#6979f8" />
          </Marker>
        </MarkerBox>

        {!!writeReviewStore.getSelectedPlace() ? (
          <SelectedPlaceText>
            <MarkIcon width="18" height="18" stroke="#6979f8" />
            {writeReviewStore.getSelectedPlace()}
          </SelectedPlaceText>
        ) : (
          <ActionButtonBox>
            <div onClick={() => navigate("/selectPlace")}>
              <ActionButton add={true}>+ 장소 등록</ActionButton>
            </div>
          </ActionButtonBox>
        )}

        <InfoText>방문한 여행지는 어떠셨나요?</InfoText>

        <StarRow>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} onClick={() => writeReviewStore.setStar(idx + 1)}>
              <StarIcon
                width="32"
                height="32"
                fill={idx < writeReviewStore.getStar() ? "#ffd990" : "#e6e6e6"}
                stroke={
                  idx < writeReviewStore.getStar() ? "#ffd990" : "#e6e6e6"
                }
              />
            </div>
          ))}
        </StarRow>

        <TextAreaBox>
          <textarea
            placeholder="여행지의 리뷰를 남겨주세요!"
            ref={contentRef}
            defaultValue={form?.content}
          />
          <span>최소 50자</span>
        </TextAreaBox>

        <ImgAddBox>
          <ImgAddButton onClick={handleButtonClick}>
            <PlusIcon stroke="#b8b8b8" />
            <input
              hidden
              ref={imageRef}
              multiple
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </ImgAddButton>

          <ImgRow>
            <ImgInfoText>
              {isEdit ? `(최대 ${10 - form?.imgs.length}장)` : "(최대 10장)"}
            </ImgInfoText>

            {images?.length !== 0 ? (
              <>
                {images?.map((image: File, idx) => (
                  <ShowImgBox key={idx}>
                    <img src={URL.createObjectURL(image)} alt="선택된 이미지" />
                    <div onClick={() => handleImageDelete(image.lastModified)}>
                      <XIcon stroke="#e6e6e6" />
                    </div>
                  </ShowImgBox>
                ))}
              </>
            ) : (
              <ImgBox>
                <div>
                  <ImageAddIcon />
                </div>

                <span>이미지 첨부</span>
              </ImgBox>
            )}
          </ImgRow>
        </ImgAddBox>
      </WriteReviewBody>

      {openModal && (
        <OneButtonModal
          isMobile
          buttonText="확인"
          onClick={handleClose}
          noCloseBtn
        >
          <ModalContainer>
            <ModalTitle>
              리뷰 {isEdit ? "수정" : "등록"}이 완료되었습니다!
            </ModalTitle>
            <ModalText>다른 여행객들에게도 도움이 될 거에요.</ModalText>
          </ModalContainer>
        </OneButtonModal>
      )}
    </>
  );
}

const HeaderText = styled.span`
  color: ${(props) => props.theme.color.secondary};
  font-size: 14px;
  font-weight: 700;
`;

const WriteReviewBody = styled.div`
  height: calc(100dvh - 50px - 20px);
  box-sizing: border-box;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
`;

const SelectedPlaceText = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.color.secondary};
  margin: 24px 0;
  gap: 2px;
`;

const MarkerBox = styled.div`
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Marker = styled.div<{ $isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  border-radius: 50px;
  border: 1px solid ${(props) => props.theme.color.gray100};
  background-color: ${(props) =>
    props.$isActive
      ? props.theme.color.secondaryLight
      : props.theme.color.gray100};
`;

const ActionButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 15px 0 21px 0;
`;

const InfoText = styled.p`
  text-align: center;
  color: ${(props) => props.theme.color.black};
  font-size: 14px;
  font-weight: 500;

  margin-bottom: 10px;
`;

const StarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const TextAreaBox = styled.div`
  margin-top: 20px;
  height: 200px;
  padding: 30px;
  position: relative;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.color.gray200};

  & > textarea {
    width: 100%;
    height: 100%;
    background-color: transparent;
    resize: none;
    border: none;
    color: ${(props) => props.theme.color.gray300};
    font-size: 14px;
    font-weight: 400;

    &::placeholder {
      color: ${(props) => props.theme.color.gray300};
      font-size: 14px;
      font-weight: 400;
    }

    &:focus {
      outline: none;
    }
  }

  & > span {
    position: absolute;
    right: 30px;
    bottom: 20px;

    color: ${(props) => props.theme.color.gray300};
    font-size: 14px;
    font-weight: 400;
  }
`;

const ImgAddBox = styled.div`
  display: flex;
  align-items: center;

  position: relative;
  overflow-y: hidden;
  height: 160px;
`;

const ImgAddButton = styled.button`
  min-width: 40px;
  min-height: 40px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.color.gray100};

  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 16px 0 8px;
`;

const ImgRow = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  gap: 6px;
`;

const ImgBox = styled.div`
  width: 125px;
  display: flex;
  padding: 45px 20px;
  align-items: center;
  justify-content: center;
  gap: 10px;

  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.color.gray200};
  background-color: ${(props) => props.theme.color.gray100};

  & > span {
    color: ${(props) => props.theme.color.gray300};
    font-size: 12px;
    white-space: nowrap;
  }
`;

const ImgInfoText = styled.span`
  bottom: 0px;
  position: absolute;

  color: ${(props) => props.theme.color.gray300};
  font-size: 12px;
`;

const ShowImgBox = styled.div`
  height: 115px;
  width: 125px;
  border-radius: 16px;
  position: relative;

  & > img {
    width: 100%;
    height: 100%;
    border-radius: 16px;
  }

  & > div {
    position: absolute;
    top: -10px;
    right: -15px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.color.white};
  }
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
`;

const ModalTitle = styled.p`
  color: ${(props) => props.theme.color.gray900};
  font-size: 16px;
  font-weight: 700;
`;

const ModalText = styled.span`
  color: ${(props) => props.theme.color.gray500};
  font-size: 14px;
`;
