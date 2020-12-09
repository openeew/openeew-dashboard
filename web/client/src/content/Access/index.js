import React, { useState } from 'react'
import Title from '../../components/Title'
import {
  TableToolbarContent,
  TableToolbarSearch,
  InlineNotification,
  TableExpandHeader,
  TableExpandedRow,
  OverflowMenuItem,
  TableExpandRow,
  TableContainer,
  TableToolbar,
  OverflowMenu,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  DataTable,
  TableRow,
  Dropdown,
  Button,
  Modal,
  Table,
  Tabs,
  Tab,
} from 'carbon-components-react'

import { Add16 } from '@carbon/icons-react'
import Tag from 'carbon-components-react/lib/components/Tag/Tag'
import Field from '../../components/Field'

const roles = [
  {
    role: 'Device owner',
    description:
      'As a device owner, you can perform all actions on your devices.',
    extraInformation:
      '- View details for all devices\n' +
      '- View details for all events\n' +
      '- View user details\n' +
      '- Disable a device\n' +
      '- Export data for all devices\n' +
      '- Invite users\n' +
      '- Assign access roles to users',
  },
  {
    role: 'Administrator',
    description:
      'As an administrator, you can perform all actions - including assigning access roles to other users.',
    extraInformation: 'No extra information available.',
  },
]

const userData = [
  {
    name: 'Luis Vasquez',
    email: 'luis.vasquez@gmail.com',
    role: 0,
  },
  {
    name: 'Jabin Morales',
    email: 'jabin.morales@gmail.com',
    role: 0,
  },
  {
    name: 'Ana Jaramillo',
    email: 'ana.jaramillo@gmail.com',
    role: 0,
  },
  {
    name: 'Aaron Williams',
    email: 'aaron.williams@gmail.com',
    role: 1,
    account_owner: true,
  },
]

const AssignRoleModal = ({ user, open, setOpen, onSave }) => {
  const [selectedRole, setSelectedRole] = useState(undefined)

  if (!open) return <></>
  return (
    <Modal
      open={open}
      primaryButtonText="Save"
      secondaryButtonText="Cancel"
      modalHeading="Assign access role"
      shouldSubmitOnEnter={false}
      onSecondarySubmit={() => {
        // set selectedRole to undefined as we're reusing this modal
        setSelectedRole(undefined)
        setOpen(false)
      }}
      onRequestSubmit={() => {
        // set selectedRole to undefined as we're reusing this modal
        setSelectedRole(undefined)
        onSave()
        setOpen(false)
      }}
      onRequestClose={() => {
        // set selectedRole to undefined as we're reusing this modal
        setSelectedRole(undefined)
        setOpen(false)
      }}
      size="sm"
    >
      <div className="assign-role__content">
        <Field title="User" value={user.name} />
        <Dropdown
          label="Role"
          titleText="Role"
          id="dropdown-role"
          items={roles}
          selectedItem={selectedRole ?? roles[user.role].role}
          onChange={(target) => setSelectedRole(target.selectedItem)}
        />
      </div>
    </Modal>
  )
}

const AccessUsers = ({ onSave }) => {
  let rows = []
  userData.forEach((user) => {
    rows.push({
      id: user.email,
      name: user.name,
      email: user.email,
      role: roles[user.role].role,
    })
  })

  const headers = [
    {
      header: 'Name',
      key: 'name',
    },
    {
      header: 'Email',
      key: 'email',
    },
    {
      header: 'Role',
      key: 'role',
    },
  ]

  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(undefined)

  return (
    <>
      <DataTable rows={rows} headers={headers}>
        {({
          rows,
          headers,
          getHeaderProps,
          getTableProps,
          getRowProps,
          getToolbarProps,
          onInputChange,
        }) => (
          <TableContainer>
            <TableToolbar {...getToolbarProps()} size="small">
              <TableToolbarContent>
                <TableToolbarSearch onChange={onInputChange} />
                <Button renderIcon={Add16}>Invite user</Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table
              {...getTableProps()}
              overflowMenuOnHover={false}
              tabIndex={0}
              aria-label={'table'}
            >
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      {...getHeaderProps({ header })}
                      tabIndex={0}
                      aria-label={`Header ${header.header}`}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                  <TableHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, indexRows) => (
                  <TableRow
                    key={row.id}
                    {...getRowProps({ row })}
                    tabIndex={0}
                    aria-label={'row ' + (indexRows + 1)}
                  >
                    {row.cells.map((cell, indexCells) => (
                      <TableCell key={cell.id}>
                        <span
                          tabIndex={0}
                          aria-label={`${headers[indexCells].header} is ${cell.value}`}
                        >
                          {cell.value}
                        </span>
                        {userData[indexRows].account_owner === true &&
                          indexCells === 0 && (
                            <Tag
                              tabIndex={0}
                              aria-label={
                                userData[indexRows].name +
                                ' is the account owner'
                              }
                            >
                              account owner
                            </Tag>
                          )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <OverflowMenu style={{ float: 'right' }} flipped>
                        <OverflowMenuItem
                          itemText="Assign role"
                          onClick={() => {
                            setSelectedUser(userData[indexRows])
                            setAssignRoleModalOpen(true)
                          }}
                        />
                      </OverflowMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      <AssignRoleModal
        user={selectedUser}
        open={assignRoleModalOpen}
        setOpen={setAssignRoleModalOpen}
        onSave={onSave}
      />
    </>
  )
}

const AccessRoles = () => {
  let headers = [
    {
      header: 'Role',
      key: 'role',
    },
    {
      header: 'Description',
      key: 'description',
    },
  ]

  const rows = roles.map((role) => {
    role['id'] = role.role
    return role
  })

  const numberOfUsersForRole = (roleIndex) =>
    userData.filter((user) => user.role === roleIndex).length

  const formatNumberMessage = (number) => {
    if (number === 1) return `There is 1 user in this role`
    else return `There are ${number} users in this role`
  }

  return (
    <DataTable rows={rows} headers={headers}>
      {({ rows, headers, getRowProps, getHeaderProps, getTableProps }) => (
        <TableContainer>
          {console.log(rows)}
          <Table
            {...getTableProps()}
            overflowMenuOnHover={false}
            tabIndex={0}
            aria-label={'table'}
          >
            <TableHead>
              <TableRow>
                <TableExpandHeader />
                {headers.map((header) => (
                  <TableHeader
                    {...getHeaderProps({ header })}
                    tabIndex={0}
                    aria-label={`Header ${header.header}`}
                  >
                    {header.header}
                  </TableHeader>
                ))}
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, indexRows) => {
                const role = roles[indexRows]
                const numberOfRoleMembers = numberOfUsersForRole(indexRows)
                return (
                  <React.Fragment key={row.id}>
                    <TableExpandRow {...getRowProps({ row })}>
                      {row.cells.map((cell, indexCells) => (
                        <TableCell key={cell.id}>
                          <span
                            tabIndex={0}
                            aria-label={`${headers[indexCells].header} is ${cell.value}`}
                          >
                            {cell.value}
                          </span>
                          {indexCells === 0 && (
                            <Tag
                              className="tag-number"
                              tabIndex={0}
                              aria-label={formatNumberMessage(
                                numberOfRoleMembers
                              )}
                            >
                              {numberOfRoleMembers}
                            </Tag>
                          )}
                        </TableCell>
                      ))}
                    </TableExpandRow>
                    <TableExpandedRow colSpan={headers.length + 1}>
                      <div className="extra-information" tabIndex={0}>
                        {role.extraInformation.split('\n').map((line) => (
                          <span>
                            {line}
                            <br />
                          </span>
                        ))}
                      </div>
                    </TableExpandedRow>
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  )
}

const Access = () => {
  const [showSaveNotification, setShowSaveNotification] = useState(false)

  return (
    <div>
      <Title>Access</Title>
      <Tabs>
        <Tab id="tab-users" label="Users" style={{ position: 'relative' }}>
          {showSaveNotification && (
            <div className="save-success-notification-parent">
              <InlineNotification
                subtitle="Your changes have been saved."
                kind="success"
                title=""
                lowContrast={false}
                onCloseButtonClick={() => setShowSaveNotification(false)}
              />
            </div>
          )}
          <AccessUsers onSave={() => setShowSaveNotification(true)} />
        </Tab>
        <Tab id="tab-roles" label="Roles">
          <AccessRoles />
        </Tab>
      </Tabs>
    </div>
  )
}

export default Access
