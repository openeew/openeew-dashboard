import React, { useContext, useState } from 'react'
import Field from '../../components/Field'
import SaveHeader from '../../components/SaveHeader'
import Title from '../../components/Title'
import { TextInput } from 'carbon-components-react'
import Context from '../../context/app'
import Button from 'carbon-components-react/lib/components/Button/Button'
import { Edit16 } from '@carbon/icons-react'
import EmailValidator from 'email-validator'

const AccountSettingsContent = ({ currentUser, isEditing, setEditing }) => {
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
          <Edit16 style={{ marginLeft: 10 }} />
        </Button>
      </div>
      <Field
        title="Name"
        value={`${currentUser.firstName} ${currentUser.lastName}`}
      />
      <Field title="Contact" value={currentUser.email} />
      <Field title="User ID" value={currentUser.userID} />
    </>
  )
}

const AccountSettingsContentEdit = ({ currentUser, setCanSave }) => {
  const isEmpty = (str) => !/[^ ]/.test(str)
  const isNameValid = (name) => !isEmpty(name)
  const isEmailValid = (email) => EmailValidator.validate(email)

  const [editedUser, setEditedUser] = useState(currentUser)

  const changeUserField = (field, value) => {
    let user = { ...editedUser }
    user[field] = value
    setEditedUser(user)
    setCanSave(
      currentUser.firstName !== user.firstName ||
        currentUser.lastName !== user.lastName ||
        currentUser.email !== user.email
    )
  }

  console.log(editedUser.email, !isEmailValid(editedUser.email))

  return (
    <div className="userinfo-edit">
      <TextInput
        id="input_firstname"
        placeholder="Your first name here"
        labelText="First name"
        value={editedUser.firstName}
        onChange={(input) => changeUserField('firstName', input.target.value)}
        invalid={!isNameValid(editedUser.firstName)}
        invalidText="Please enter your first name"
      />
      <TextInput
        id="input_lastname"
        placeholder="Your last name here"
        labelText="Last name"
        value={editedUser.lastName}
        onChange={(input) => changeUserField('lastName', input.target.value)}
        invalid={!isNameValid(editedUser.lastName)}
        invalidText="Please enter your last name"
      />
      <TextInput
        id="input_email"
        placeholder="Your email here"
        labelText="Contact"
        value={editedUser.email}
        onChange={(input) => changeUserField('email', input.target.value)}
        invalid={!isEmailValid(editedUser.email)}
        invalidText="Invalid email"
      />
      <Field title="User ID" value={currentUser.userID} />
    </div>
  )
}

const AccountSettings = () => {
  const { currentUser, setCurrentUser } = useContext(Context)
  const [isEditing, setEditing] = useState(false)
  const [canSave, setCanSave] = useState(false)

  console.log('canSave', canSave)

  return (
    <>
      <Title>Profile</Title>
      <div className="userinfo-parent">
        {isEditing && (
          <SaveHeader
            title="User Information"
            onCancel={() => setEditing(false)}
            onSave={() => setEditing(false)}
            canSave={canSave}
          />
        )}
        <div className="userinfo">
          {isEditing ? (
            <AccountSettingsContentEdit
              currentUser={currentUser}
              setCanSave={setCanSave}
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
