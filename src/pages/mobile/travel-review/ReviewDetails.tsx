import { useParams } from "react-router-dom";
import styled from "styled-components";
import { axiosInstance } from "../../../utils/axios";
import { useEffect, useState } from "react";
import { ReviewDetailApiProps } from "../../../types/home.details";
import * as R from "../../../assets/styles/travelReview.style";
import CustomHeader from "../../../components/mobile/CustomHeader";
import CustomProfile from "../../../components/mobile/CustomProfile";
import StarIcon from "../../../assets/icons/StarIcon";
import ImageView from "../../../components/mobile/ImageView";
import LikeIcon from "../../../assets/icons/LikeIcon";
import CommentIcon from "../../../assets/icons/CommentIcon";
import CommentCard from "../../../components/mobile/CommentCard";
import { commentResDto } from "../../../types/res.dto";
import { testImageList } from "../../../utils/staticDatas";
import ImageModal from "../../../components/mobile/ImageModal";

export default function ReviewDetails() {
  const params = useParams();
  const [review, setReview] = useState<ReviewDetailApiProps>();
  const [loading, setLoading] = useState(false);
  const [fillLike, setFillLike] = useState(false);
  const [comment, setComment] = useState("");
  const [commentCnt, setCommentCnt] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const requestApi = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/review/${params?.reviewId}`);

        if (res.status === 200) {
          console.log(res);
          setReview(res.data);
          setCommentCnt(res.data.commentResDtoList.length);
        }
      } catch (error) {
        console.error("api error=", error);
      } finally {
        setLoading(false);
      }
    };
    requestApi();
  }, [params?.reviewId]);

  const handleWriteCommentSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(`${comment} submit`);
  };

  return (
    <ReviewDetailContainer>
      <CustomHeader title="오대산 선재길" isPlace fontSize="16px" />
      {loading && <NoResultsText>로딩중...</NoResultsText>}
      {isModalOpen && (
        <ImageModal
          imageList={testImageList}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {!loading && (
        <ReviewDetailsBody>
          <R.ProfileHeader>
            <CustomProfile
              src="/src/assets/images/testImg.png"
              nickname={review?.userCompactResDto.nickname}
              content="24.2.3"
            />
            <R.IconBox>
              <StarIcon />
              <span>{review?.star}</span>
            </R.IconBox>
          </R.ProfileHeader>
          <p>{review?.content}</p>
          <ReviewDetailsImageBox>
            {/* [TODO]: 이미지 api 연결해서 mapping, 4장 이상일 때 +1 표시 추가 */}
            {testImageList.slice(0, 4).map((url, i) => (
              <ImageWrapper key={i}>
                <ImageView
                  src={url}
                  alt="review img"
                  width="100%"
                  height="129px"
                />
                <ImageOverlay
                  isLast={i === 3}
                  onClick={() => setIsModalOpen(true)}
                >
                  <span>{`+ ${testImageList.length - 3}`}</span>
                </ImageOverlay>
              </ImageWrapper>
            ))}
          </ReviewDetailsImageBox>
          <R.LikeCommentBox>
            <R.IconBox>
              <LikeIcon
                fill={fillLike ? "#FFC814" : "none"}
                onClick={() => setFillLike((prev) => !prev)}
              />
              <span>{review?.likeCnt}</span>
            </R.IconBox>
            <R.IconBox>
              <CommentIcon stroke="#808080" />
              <span>{review?.commentResDtoList.length}</span>
            </R.IconBox>
          </R.LikeCommentBox>
          <R.CommentsBox>
            <p>댓글</p>
            <R.CommentInputBox>
              <R.CommentInput>
                <input
                  type="text"
                  placeholder="댓글을 작성해주세요."
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
              </R.CommentInput>
              <R.CommentWriteButton
                type="submit"
                fill={true}
                onClick={handleWriteCommentSubmit}
              >
                등록
              </R.CommentWriteButton>
            </R.CommentInputBox>
            {commentCnt == 0 && (
              <NoCommentBox>첫 댓글을 작성해주세요!</NoCommentBox>
            )}
            {commentCnt > 0 &&
              review?.commentResDtoList.map((item: commentResDto) => {
                return (
                  <CommentCard
                    key={item.id}
                    content="좋은 리뷰네요!"
                    createdAt="24.2.3"
                    user={item.userCompactResDto}
                    replyList={item.replyList}
                  />
                );
              })}
          </R.CommentsBox>
        </ReviewDetailsBody>
      )}
    </ReviewDetailContainer>
  );
}

const ReviewDetailContainer = styled.div`
  height: 100%;
  min-width: 360px;
`;

const NoResultsText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
  color: ${(props) => props.theme.color.gray300};
`;

const ReviewDetailsBody = styled.div`
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  overflow-y: auto;
  gap: 12px;

  & > p {
    font-size: 14px;
    color: ${(props) => props.theme.color.gray900};
  }
`;

const ReviewDetailsImageBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
`;

const NoCommentBox = styled.div`
  padding: 16px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.color.gray100};
  color: ${(props) => props.theme.color.gray900};
  font-size: 14px;
  text-align: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block; /* Ensure the wrapper sizes to the image */
`;

const ImageOverlay = styled.div<{ isLast: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dark overlay */
  visibility: ${(props) => (props.isLast ? "visible" : "hidden")};
  z-index: 1;
  border-radius: 16px;
  cursor: pointer;

  display: grid;
  place-items: center;
  & > span {
    font-weight: 700;
    font-size: 12px;
    color: ${(props) => props.theme.color.white};
  }
`;