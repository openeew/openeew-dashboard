import React, { useContext } from "react";
import {
  Header,
  HeaderNavigation,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from "carbon-components-react/lib/components/UIShell";
import { Link } from "react-router-dom";
import Notification20 from "@carbon/icons-react/lib/notification/20";
import UserAvatar20 from "@carbon/icons-react/lib/user--avatar/20";
import Context from "../../context/app";

const TutorialHeader = () => {
  const { t } = useContext(Context)

  return (
    <Header aria-label={t("components.header.title")}>
      <SkipToContent />
      <Link to="/" className="bx--header__name">
        {t("components.header.title")}
      </Link>
      <HeaderNavigation aria-label={t("components.header.title")}>
        {/* Nav items go here */}
      </HeaderNavigation>
      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label={t("components.header.notifications")}>
          <Notification20 />
        </HeaderGlobalAction>
        <Link to="/settings">
          <HeaderGlobalAction aria-label={t("components.header.avatar")}>
            <UserAvatar20 />
          </HeaderGlobalAction>
        </Link>
      </HeaderGlobalBar>
    </Header>
  )
};

export default TutorialHeader;
