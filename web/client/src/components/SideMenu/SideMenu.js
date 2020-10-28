import React, { useContext } from 'react';
import {
  SideNav,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react/lib/components/UIShell';
import { Settings32 } from '@carbon/icons-react';
import Context from "../../context/app";

function SideMenu() {
  const { t } = useContext(Context);

  return (
    <SideNav isRail isChildOfHeader={false} aria-label={t("components.sidemenu.title")}>
      <SideNavItems>
        <SideNavLink renderIcon={Settings32} href="#">
          {t("components.sidemenu.settings")}
        </SideNavLink>
      </SideNavItems>
    </SideNav>
  );
}

export default SideMenu;
