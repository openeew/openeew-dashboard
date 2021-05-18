import { Close24, ConnectionSignal32, Restart32 } from '@carbon/icons-react'
import Tag from 'carbon-components-react/lib/components/Tag/Tag'
import {
  Loading,
  Modal,
  InlineNotification,
  ToastNotification,
} from 'carbon-components-react'
import Field from '../Field'
import semver from 'semver'

import { ReactComponent as IoTPlatform32 } from '../../assets/iot--platform.svg'
import { useContext, useState } from 'react'
import AppContext from '../../context/app'

import { useMutation } from '@apollo/client'
import {
  SEND_EARTHQUAKE_TO_SENSOR,
  STOP_EARTHQUAKE_TEST,
  SEND_RESTART_SENSOR,
  SEND_UPDATE_REQUEST,
} from '../../graphql/mutations'
import { handleGraphQLError } from '../../graphql/error'

const SensorsInformationSidePanel = ({
  sensor,
  onRequestClose,
  getSensorStatus,
}) => {
  const { t, currentFirmwareInfo } = useContext(AppContext)

  const [testModalOpen, setTestModalOpen] = useState(false)
  const [testingSensor, setTestingSensor] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [interactionError, setInteractionError] = useState({
    type: null,
    message: '',
  })

  const [sendEarthquakeToSensor] = useMutation(SEND_EARTHQUAKE_TO_SENSOR)
  const [stopEarthquakeTest] = useMutation(STOP_EARTHQUAKE_TEST)
  const [sendRestartSensor] = useMutation(SEND_RESTART_SENSOR)
  const [updateSensor] = useMutation(SEND_UPDATE_REQUEST)

  const testSensor = () => {
    setTestModalOpen(false)
    setTestingSensor(true)
    setInteractionError({
      type: null,
      message: '',
    })

    sendEarthquakeToSensor({ variables: { sensorId: sensor.id } })
      .then(() => {
        setTimeout(() => {
          setTestingSensor(false)
        }, 13000)
      })
      .catch((e) => {
        setTestingSensor(false)

        console.log(JSON.stringify(e))

        return handleGraphQLError(
          e,
          'sendEarthquakeToSensor',
          setInteractionError
        )
      })
  }

  const stopTest = () => {
    stopEarthquakeTest({ variables: { sensorId: sensor.id } })
      .then(() => {})
      .catch((e) => {
        return handleGraphQLError(e, 'stopEarthquake', setInteractionError)
      })
  }

  const restartSensor = () => {
    setRestarting(true)

    sendRestartSensor({ variables: { sensorId: sensor.id } })
      .then(() => {
        setTimeout(() => setRestarting(false), 60000)
      })
      .catch((e) => {
        setRestarting(false)
        console.log(JSON.stringify(e))
        return handleGraphQLError(e, 'sendRestartSensor', setInteractionError)
      })
  }

  const updateFirmware = () => {
    setUpdating(true)

    updateSensor({ variables: { sensorId: sensor.id } })
      .then(() => {
        setTimeout(() => {
          setUpdating(false)
        }, 120000)
      })
      .catch(() => {})
  }

  return (
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
        <button className="sensors-side-panel__close" onClick={onRequestClose}>
          <Close24 />
        </button>
      </div>
      <div className="sensors-side-panel__content">
        {/* Checks if current firmware version is greater than or equal to latest release in repo */}
        {currentFirmwareInfo.verNum &&
        semver.gt(currentFirmwareInfo.verNum, sensor.firmwareVer) &&
        !updating ? (
          <ToastNotification
            kind="info"
            caption=""
            subtitle={
              <button
                className={'sensors-side-panel__updateLink'}
                onClick={updateFirmware}
              >
                {t('content.sensors.sidePanel.updateNow')}
              </button>
            }
            timeout={0}
            hideCloseButton={true}
            title={
              t('content.sensors.sidePanel.newFirmwareAvailable') +
              ` (v${currentFirmwareInfo.verNum})`
            }
          />
        ) : null}

        {/* If sensor is updating... */}
        {updating ? (
          <div className="sensors-side-panel__updatingToast">
            <ToastNotification
              kind="info"
              caption=""
              subtitle={t('content.sensors.sidePanel.updatingSubTitle')}
              timeout={0}
              hideCloseButton={true}
              title={t('content.sensors.sidePanel.updatingTitle')}
            />
            <Loading
              description={t('content.sensors.sidePanel.restarting')}
              withOverlay={false}
              small
            />
          </div>
        ) : null}

        <Field
          title="Firmware version"
          value={sensor.firmwareVer}
          secondary={
            currentFirmwareInfo.verNum &&
            (semver.lt(currentFirmwareInfo.verNum, sensor.firmwareVer) ||
              currentFirmwareInfo.verNum === sensor.firmwareVer)
              ? 'Up to date'
              : null
          }
        />

        {/* Send test earthquake */}
        <div className="button-label">
          <ConnectionSignal32 />
          {t('content.sensors.sidePanel.sendTestEarthquake')}
        </div>
        <button
          className="sensors-side-panel__button"
          disabled={updating || restarting}
          onClick={() => {
            if (testingSensor) {
              setTestingSensor(false)
              stopTest()
            } else setTestModalOpen(true)
          }}
          data-testing-sensor={testingSensor}
        >
          {testingSensor
            ? t('content.sensors.sidePanel.stopTest')
            : t('content.sensors.sidePanel.sendTestEarthquakeButton')}
        </button>

        {interactionError.message &&
        interactionError.type === 'sendEarthquakeToSensor' ? (
          <InlineNotification
            kind="error"
            tabIndex={0}
            title={interactionError.message}
            hideCloseButton={true}
          />
        ) : null}

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
            disabled={updating || restarting}
          >
            {t('content.sensors.sidePanel.restartSensorButton')}
          </button>
        )}

        {/* Send 30 seconds of data */}
        <div className="button-label">
          <IoTPlatform32 />
          {t('content.sensors.sidePanel.sendSecondsOfData')}
        </div>
        <button
          className="sensors-side-panel__button"
          disabled={updating || restarting}
        >
          {t('content.sensors.sidePanel.sendSecondsOfDataButton')}
        </button>
      </div>
    </div>
  )
}

export default SensorsInformationSidePanel
