import React from 'react'
import {
  Header,
  HeaderName,
} from 'carbon-components-react/lib/components/UIShell'

const _Header = (props) => {
  return (
    <Header aria-label="OpenEEW Dashboard">
      <HeaderName href="#" prefix="OpenEEW">
        Dashboard
      </HeaderName>
    </Header>
  )
}

export default _Header
