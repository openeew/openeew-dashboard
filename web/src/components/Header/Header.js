import React from "react";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from "carbon-components-react/lib/components/UIShell";
import Notification20 from "@carbon/icons-react/lib/notification/20";
import UserAvatar20 from "@carbon/icons-react/lib/user--avatar/20";

const TutorialHeader = () => (
  <Header aria-label="Open EEW Network Monitoring">
    <SkipToContent />
    <HeaderName href="/" prefix="OpenEEW">
      Network Monitoring
    </HeaderName>
    <HeaderNavigation aria-label="Open EEW Network Monitoring">
      {/* Nav items go here */}
    </HeaderNavigation>
    <HeaderGlobalBar>
      <HeaderGlobalAction aria-label="Notifications">
        <Notification20 />
      </HeaderGlobalAction>
      <HeaderGlobalAction aria-label="User Avatar">
        <UserAvatar20 />
      </HeaderGlobalAction>
    </HeaderGlobalBar>
  </Header>
);

export default TutorialHeader;
