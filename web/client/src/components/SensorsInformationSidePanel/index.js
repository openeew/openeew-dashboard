import { Close24, ConnectionSignal32, Restart32 } from '@carbon/icons-react'
import Tag from 'carbon-components-react/lib/components/Tag/Tag'
import { Loading, Modal, ToastNotification } from 'carbon-components-react'
import Field from '../Field'

import { ReactComponent as IoTPlatform32 } from '../../assets/iot--platform.svg'
import { useContext, useState } from 'react'
import AppContext from '../../context/app'

const SensorsInformationSidePanel = ({
  sensor,
  onRequestClose,
  getSensorStatus,
}) => {
  const { t } = useContext(AppContext)

  const [testModalOpen, setTestModalOpen] = useState(false)
  const [testingSensor, setTestingSensor] = useState(false)
  const [restarting, setRestarting] = useState(false)

  const testSensor = () => {
    setTestModalOpen(false)
    setTestingSensor(true)
  }

  const restartSensor = () => {
    setRestarting(true)
    setTimeout(() => setRestarting(false), 5000)
  }

  return (
    <div className="sensors-side-panel__background">
      <div className="sensors-side-panel">
        <Modal
          open={testModalOpen}
          modalHeading={t('content.sensors.sidePanel.modalTestTitle')}
          size="xs"
          secondaryButtonText={t('content.modal_basic.cancel')}
          primaryButtonText={t('content.modal_basic.confirm')}
          onRequestClose={() => setTestModalOpen(false)}
          onRequestSubmit={testSensor}
        >
          {t('content.sensors.sidePanel.modalTestText')}
        </Modal>
        <div className="sensors-side-panel__header">
          <h4
            className={`sensors-side-panel__title ${getSensorStatus(
              sensor.lastCheckin
            )}`}
            data-after="true"
          >
            Sensor {sensor.id}
          </h4>
          {sensor.isUserOwner && (
            <Tag className="tag-owner" tabIndex={0} aria-label="My sensor">
              My sensor
            </Tag>
          )}
          <button
            className="sensors-side-panel__close"
            onClick={onRequestClose}
          >
            <Close24 />
          </button>
        </div>
        <div className="sensors-side-panel__content">
          <ToastNotification
            kind="info"
            caption=""
            subtitle={
              <a href="#">{t('content.sensors.sidePanel.updateNow')}</a>
            }
            timeout={0}
            hideCloseButton={true}
            title={t('content.sensors.sidePanel.newFirmwareAvailable')}
          />
          <Field title="Firmware version" value={sensor.firmwareVer} />
          {/* Send test earthquake */}
          <div className="button-label">
            <ConnectionSignal32 />
            {t('content.sensors.sidePanel.sendTestEarthquake')}
          </div>
          <button
            className="sensors-side-panel__button"
            onClick={() => {
              if (testingSensor) setTestingSensor(false)
              else setTestModalOpen(true)
            }}
            data-testing-sensor={testingSensor}
          >
            {testingSensor
              ? t('content.sensors.sidePanel.stopTest')
              : t('content.sensors.sidePanel.sendTestEarthquakeButton')}
          </button>
          {/* Restart sensor */}
          <div className="button-label">
            <Restart32 />
            {t('content.sensors.sidePanel.restartSensor')}
          </div>
          {restarting ? (
            <div className="sensors-side-panel__restarting">
              <Loading
                description={t('content.sensors.sidePanel.restarting')}
                withOverlay={false}
                small
              />
              <p>{t('content.sensors.sidePanel.restarting')}</p>
            </div>
          ) : (
            <button
              className="sensors-side-panel__button"
              onClick={restartSensor}
            >
              {t('content.sensors.sidePanel.restartSensorButton')}
            </button>
          )}
          {/* Send 30 seconds of data */}
          <div className="button-label">
            <IoTPlatform32 />
            {t('content.sensors.sidePanel.sendSecondsOfData')}
          </div>
          <button className="sensors-side-panel__button">
            {t('content.sensors.sidePanel.sendSecondsOfDataButton')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SensorsInformationSidePanel
