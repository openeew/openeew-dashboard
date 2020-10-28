import React, { useContext } from 'react';
import Context from '../../context/app';

function AccountSettings() {
  const { currentUser, t } = useContext(Context);

  return (
    <div>{t("content.accountSettings.welcome", currentUser)}</div>
  );
}

export default AccountSettings;
