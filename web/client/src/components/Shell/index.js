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
import { Link } from 'react-router-dom'
import history from '../../history'

const Shell = ({ isSideNavExpanded, sideNavToggle }) => (
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
    <HeaderName element={Link} to="/events" prefix="OpenEEW">
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
        <SideNavLink
          onClick={() => {
            sideNavToggle(false)
          }}
          renderIcon={Activity32}
          to="/events"
          element={Link}
        >
          Events
        </SideNavLink>
        <SideNavLink
          onClick={() => {
            sideNavToggle(false)
          }}
          renderIcon={ConnectionSignal32}
          to="/sensors"
          element={Link}
        >
          Sensors
        </SideNavLink>
        <SideNavLink
          onClick={() => {
            sideNavToggle(false)
          }}
          renderIcon={UserAvatarFilledAlt32}
          to="/access"
          element={Link}
        >
          Access
        </SideNavLink>
      </SideNavItems>
    </SideNav>
  </Header>
)

export default Shell
