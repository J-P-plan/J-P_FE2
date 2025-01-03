import styled, { css } from "styled-components";
import { webHeaderTabs } from "../../utils/staticDatas";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "../../store/modal.store";
import SearchIcon from "../../assets/icons/SearchIcon";
import ProfileIcon from "../../assets/icons/ProfileIcon";
import { Cookies, useCookies } from "react-cookie";
import { useUserStore } from "../../store/user.store";
import logoImg from "../../assets/images/logo.png";

interface Props {
  minWidth: string;
}

export default function Header({ minWidth }: Props) {
  const cookies = new Cookies();
  const [, , removeCookie] = useCookies();
  const userStore = useUserStore();
  const navigate = useNavigate();
  const { getCurrentModal, setCurrentModal } = useModalStore();

  const handleSearch = () => {
    if (getCurrentModal() === "search") {
      return setCurrentModal("");
    } else {
      return setCurrentModal("search");
    }
  };

  const handleTab = (route: string) => {
    navigate(route);
    setCurrentModal("");
  };

  const handleLoginOut = () => {
    if (!!cookies.get("userToken")) {
      removeCookie("userToken", { path: "/" });
      userStore.setUserName("");
      userStore.setUserProfile("");
    } else {
      navigate("/");
    }
  };

  return (
    <HeaderContainer $minWidth={minWidth}>
      <HeaderLeft>
        <Logo>
          <img src={logoImg} alt="로고 이미지" />
        </Logo>

        <HeaderTabRow>
          {webHeaderTabs.map((tab) => (
            <li onClick={() => handleTab(tab.route)} key={tab.label}>
              {tab.label}
            </li>
          ))}
        </HeaderTabRow>
      </HeaderLeft>

      <HeaderRight>
        <div onClick={handleSearch}>
          <SearchIcon />
        </div>

        <div onClick={() => handleTab("/home/mypage/travel")}>
          <ProfileIcon />
        </div>

        <LoginButton onClick={handleLoginOut}>
          {!!cookies.get("userToken") ? "로그아웃" : "로그인"}
        </LoginButton>
      </HeaderRight>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header<{ $minWidth: string }>`
  width: 100%;
  min-width: ${(props) => props.$minWidth && props.$minWidth};
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  box-sizing: border-box;
  padding: 0 120px;
  background-color: ${(props) => props.theme.color.white};
`;

const Logo = styled.div``;

const headerTextStyle = css`
  color: ${(props) => props.theme.color.gray900};
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
`;

const HeaderLeft = styled.section`
  display: flex;
  align-items: center;
  gap: 200px;
`;

const HeaderTabRow = styled.ul`
  display: flex;
  align-items: center;
  gap: 89px;

  & > li {
    ${headerTextStyle}
  }
`;

const HeaderRight = styled.section`
  display: flex;
  align-items: center;
  gap: 60px;

  & > div {
    cursor: pointer;
  }
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 50px;
  border-radius: 16px;

  background: ${(props) => props.theme.color.main};
  color: ${(props) => props.theme.color.white};
  font-size: 16px;
  font-weight: 700;

  &:hover {
    background-color: ${(props) => props.theme.color.mainHover};
  }
`;
