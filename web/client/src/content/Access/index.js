import React, { useState } from 'react'
import Title from '../../components/Title'
import {
  TableToolbarContent,
  TableToolbarSearch,
  OverflowMenuItem,
  TableContainer,
  TableToolbar,
  OverflowMenu,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  DataTable,
  TableRow,
  Button,
  Modal,
  Table,
  Tabs,
  Tab,
  Dropdown,
  InlineNotification,
} from 'carbon-components-react'

import { Add16 } from '@carbon/icons-react'
import Tag from 'carbon-components-react/lib/components/Tag/Tag'
import Field from '../../components/Field'

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

const roles = ['Device owner', 'Administrator']

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
          selectedItem={selectedRole ?? roles[user.role]}
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
      role: roles[user.role],
    })
  })

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
            <Table {...getTableProps()} overflowMenuOnHover={false}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                  <TableHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, indexRows) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell, indexCells) => (
                      <TableCell key={cell.id}>
                        {cell.value}
                        {userData[indexRows].account_owner === true &&
                          indexCells === 0 && <Tag>account owner</Tag>}
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
        <Tab id="tab-roles" label="Roles"></Tab>
      </Tabs>
    </div>
  )
}

export default Access
