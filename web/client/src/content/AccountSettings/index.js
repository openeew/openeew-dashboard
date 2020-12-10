import React, { useContext, useState } from 'react'
import Field from '../../components/Field'
import SaveHeader from '../../components/SaveHeader'
import Title from '../../components/Title'
import { TextInput, Dropdown } from 'carbon-components-react'
import Context from '../../context/app'
import Button from 'carbon-components-react/lib/components/Button/Button'

const AccountSettingsContent = ({ isEditing, setEditing }) => {
  return (
    <>
      <div className="userinfo_header">
        <span className="userinfo_title" tabIndex={0}>
          User Information
        </span>
        <Button
          kind="ghost"
          className="userinfo_edit"
          onClick={() => setEditing(!isEditing)}
        >
          Edit
        </Button>
      </div>
      <Field title="Name" value="Test Name" />
      <Field title="Language" value="English" />
      <Field title="Contact" value="test@example.com" />
      <Field title="User ID" value="123456789" />
    </>
  )
}

const AccountSettingsContentEdit = () => {
  return (
    <div className="userinfo-edit">
      <TextInput
        id="input_name"
        placeholder="Enter your name here"
        labelText="Name"
      />
      <Dropdown
        id="dropdown_language"
        titleText="Language"
        selectedItem="English"
        label="Select a language"
        items={['English', 'Gibberish']}
      />
      <TextInput
        id="input_contact"
        placeholder="Enter your email-address here"
        labelText="Contact"
      />
      <TextInput
        id="input_userid"
        value="123456789"
        labelText="User ID"
        aria-label="read-only user ID"
        readOnly={true}
      />
    </div>
  )
}

const AccountSettings = () => {
  const { currentUser } = useContext(Context)
  const [isEditing, setEditing] = useState(false)

  return (
    <>
      <Title>Profile</Title>
      <div className="userinfo-parent">
        {isEditing && (
          <SaveHeader
            title="User Information"
            onCancel={() => setEditing(false)}
            onSave={() => setEditing(false)}
          />
        )}
        <div className="userinfo">
          {isEditing ? (
            <AccountSettingsContentEdit
              currentUser={currentUser}
              isEditing={isEditing}
              setEditing={setEditing}
            />
          ) : (
            <AccountSettingsContent
              currentUser={currentUser}
              isEditing={isEditing}
              setEditing={setEditing}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default AccountSettings
