import React, { useState } from 'react';
import Shell from '../../components/Shell';

function Dashboard() {
  const [isSideNavExpanded, sideNavToggle] = useState(false);

  return (
    <div>
      <Shell
        isSideNavExpanded={isSideNavExpanded}
        sideNavToggle={sideNavToggle}
      />
    </div>
  );
}

export default Dashboard;
