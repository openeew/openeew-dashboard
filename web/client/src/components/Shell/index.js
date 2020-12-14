import React from 'react'
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react/lib/components/UIShell'

import {
  ConnectionSignal32,
  UserAvatar32,
  Activity32,
  UserAvatarFilledAlt32,
} from '@carbon/icons-react'

const Shell = ({ isSideNavExpanded, sideNavToggle, history }) => (
  <Header aria-label="OpenEEW Dashboard">
    <SkipToContent />
    <HeaderMenuButton
      aria-label="Open menu"
      isCollapsible
      onClick={() =>
        isSideNavExpanded ? sideNavToggle(false) : sideNavToggle(true)
      }
      isActive={isSideNavExpanded}
    />
    <HeaderName href="#" prefix="OpenEEW">
      Dashboard
    </HeaderName>

    <HeaderGlobalBar>
      <HeaderGlobalAction
        aria-label="Account Settings"
        onClick={() => {
          history.push('/settings')
        }}
      >
        <UserAvatar32 />
      </HeaderGlobalAction>
    </HeaderGlobalBar>
    <SideNav
      aria-label="Side navigation"
      isFixedNav
      expanded={isSideNavExpanded}
    >
      <SideNavItems>
        <SideNavLink renderIcon={Activity32} href="/#/events">
          Events
        </SideNavLink>
        <SideNavLink renderIcon={ConnectionSignal32} href="#">
          Devices
        </SideNavLink>
        <SideNavLink renderIcon={UserAvatarFilledAlt32} href="/#/access">
          Access
        </SideNavLink>
      </SideNavItems>
    </SideNav>
  </Header>
)

export default Shell
