import React, { useContext } from 'react'
import {
  TableCell,
  OverflowMenu,
  OverflowMenuItem,
} from 'carbon-components-react'
import AppContext from '../../context/app'

const SensorOverflowMenu = ({ id, sensor, onModify, onRemove }) => {
  const { t } = useContext(AppContext)

  return (
    <TableCell key={id + '-overflow'} className="sticky-column right">
      <OverflowMenu style={{ float: 'right' }} flipped>
        <OverflowMenuItem
          itemText={t('content.sensors.rowOverflow.interact')}
          onClick={() => onModify(sensor)}
        />
        <OverflowMenuItem
          itemText={t('content.sensors.rowOverflow.remove')}
          onClick={() => onRemove(sensor)}
        />
      </OverflowMenu>
    </TableCell>
  )
}

export default SensorOverflowMenu
