import React from 'react'
import {
  TableCell,
  OverflowMenu,
  OverflowMenuItem,
} from 'carbon-components-react'

const SensorOverflowMenu = ({ id }) => {
  return (
    <TableCell key={id + '-overflow'} className="sticky-column right">
      <OverflowMenu style={{ float: 'right' }} flipped>
        <OverflowMenuItem
          itemText="wow, a button"
          onClick={() => alert('wow, an alert')}
        />
      </OverflowMenu>
    </TableCell>
  )
}

export default SensorOverflowMenu
