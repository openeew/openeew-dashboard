import React from "react";
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

const TutorialHeader = () => (
  <Header aria-label="Open EEW Network Monitoring">
    <SkipToContent />
    <Link to="/" className="bx--header__name">
      OpenEEW Network Monitoring
    </Link>
    <HeaderNavigation aria-label="Open EEW Network Monitoring">
      {/* Nav items go here */}
    </HeaderNavigation>
    <HeaderGlobalBar>
      <HeaderGlobalAction aria-label="Notifications">
        <Notification20 />
      </HeaderGlobalAction>
      <Link to="/settings">
        <HeaderGlobalAction aria-label="User Avatar">
          <UserAvatar20 />
        </HeaderGlobalAction>
      </Link>
    </HeaderGlobalBar>
  </Header>
);

export default TutorialHeader;
