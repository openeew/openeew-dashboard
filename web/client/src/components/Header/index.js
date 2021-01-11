import React from 'react'
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from 'carbon-components-react/lib/components/UIShell'

const _Header = ({ removeLogin, history }) => {
  return (
    <Header aria-label="OpenEEW Dashboard">
      <HeaderName href="#" prefix="OpenEEW">
        Dashboard
      </HeaderName>
      {removeLogin ? null : (
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label="Log in"
            style={{ color: '#f4f4f4', width: '100px' }}
            onClick={() => {
              history.push('/login')
            }}
          >
            Log In
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      )}
    </Header>
  )
}

export default _Header
