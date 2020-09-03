import React from 'react';
import {
  SideNav,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react/lib/components/UIShell';
import { Settings32 } from '@carbon/icons-react';

function SideMenu() {
  return (
    <SideNav isRail isChildOfHeader={false} aria-label="Side navigation">
      <SideNavItems>
        <SideNavLink renderIcon={Settings32} href="#">
          Settings
        </SideNavLink>
      </SideNavItems>
    </SideNav>
  );
}

export default SideMenu;
