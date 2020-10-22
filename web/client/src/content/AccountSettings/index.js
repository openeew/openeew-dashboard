import React, { useContext } from 'react';
import Context from '../../context/app';

function AccountSettings() {
  const { currentUser } = useContext(Context);

  return (
    <div>Welcome {currentUser.name}!</div>
  );
}

export default AccountSettings;
