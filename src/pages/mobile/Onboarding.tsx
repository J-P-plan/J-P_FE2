import styled from "styled-components";
import img from "../../assets/images/onboarding.png";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  // 아래는 제가 생각한 방법 입니다!
  // 구글 계정으로 로그인 성공시
  // 1. 예시로 userId가 서버로부터 넘어옴
  // 2. zustand - store에 저장
  // 3. userId 정보가 null이 아니면 survey page 띄우기

  return (
    <>
      <OnboardingContainer>
        <OnBoardingTopBox>
          <OnboardingTitle>
            여행을 더 즐겁게, <br />
            함께 계획하고 공유해요!
            <br />
            <span>더 특별한 나만의 여행기를 만들어요.</span>
          </OnboardingTitle>
        </OnBoardingTopBox>
        <OnBoardingBottomBox>
          <GoogleLoginButton>
            <GoogleIcon />
            <p>구글 계정으로 시작하기</p>
          </GoogleLoginButton>
          <JustLookButton onClick={() => navigate("/home")}>
            <p>서비스 둘러보기</p> <ArrowRightIcon />
          </JustLookButton>
        </OnBoardingBottomBox>
      </OnboardingContainer>
    </>
  );
}

const OnboardingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${img});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

const OnBoardingTopBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  flex-grow: 2.5;
  margin-top: 32px;
`;

const OnBoardingBottomBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const OnboardingTitle = styled.p<{ subtitle?: boolean }>`
  width: 226px;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  color: ${(props) => props.theme.color.white};
  flex-shrink: 0;
  white-space: nowrap;

  & > span {
    font-size: 14px;
    font-weight: 500;
    padding-top: 12px;
  }
`;

const GoogleLoginButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.color.white};
  padding: 14px;
  gap: 12px;
  border-radius: 16px;
  cursor: pointer;

  & > p {
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 700;
  }
`;

const JustLookButton = styled.div`
  width: 120px;
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  margin-top: 49px;
  color: ${(props) => props.theme.color.white};
  cursor: pointer;
  white-space: nowrap;
`;