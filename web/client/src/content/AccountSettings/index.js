import React, { useContext, useState } from 'react'
import Field from '../../components/Field'
import SaveHeader from '../../components/SaveHeader'
import Title from '../../components/Title'
import { TextInput } from 'carbon-components-react'
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
        id="input_firstname"
        placeholder="Your first name here"
        labelText="First name"
      />
      <TextInput
        id="input_lastname"
        placeholder="Your last name here"
        labelText="Last name"
      />
      <TextInput
        id="input_email"
        placeholder="test@example.com"
        labelText="Contact"
      />
      <Field title="User ID" value="123456789" />
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
