import React from "react";
import Title from "../../components/Title";
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
  Table,
  Tabs,
  Tab
} from "carbon-components-react";

import { Add16 } from "@carbon/icons-react";
import Tag from "carbon-components-react/lib/components/Tag/Tag";

const headers = [
  {
    header: "Name",
    key: "name"
  },
  {
    header: "Email",
    key: "email"
  },
  {
    header: "Role",
    key: "role"
  }
]

const userData = [
  {
    name: "Luis Vasquez",
    email: "luis.vasquez@gmail.com",
    role: "Device owner"
  },
  {
    name: "Jabin Morales",
    email: "jabin.morales@gmail.com",
    role: "Device owner"
  },
  {
    name: "Ana Jaramillo",
    email: "ana.jaramillo@gmail.com",
    role: "Device owner"
  },
  {
    name: "Aaron Williams",
    email: "aaron.williams@gmail.com",
    role: "Administrator",
    account_owner: true
  }
]

const AccessUsers = () => {
  let rows = [];
  userData.forEach(user => {
    rows.push({
      id: user.email,
      name: user.name,
      email: user.email,
      role: user.role
    })
  })

  return (
    <DataTable rows={rows} headers={headers}>
      {({
          rows,
          headers,
          getHeaderProps,
          getTableProps,
          getRowProps,
          getToolbarProps,
          onInputChange
      }) => (
        <TableContainer>
          <TableToolbar {...getToolbarProps()} size="small">
            <TableToolbarContent>
              <TableToolbarSearch onChange={onInputChange}/>
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
                <TableHeader/>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, indexRows) => (
                <TableRow key={row.id} {...getRowProps({ row })}>
                  {row.cells.map((cell, indexCells) => (
                    <TableCell key={cell.id}>
                      {cell.value}
                      {
                        userData[indexRows].account_owner === true
                        && indexCells === 0
                        && <Tag>account owner</Tag>
                      }
                    </TableCell>
                  ))}
                  <TableCell>
                    <OverflowMenu style={{marginLeft: "auto"}} left>
                      <OverflowMenuItem itemText="Assign role"/>
                    </OverflowMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  )
}

const Access = () => {
  return (
    <div>
      <Title>Access</Title>
      <Tabs>
        <Tab id="tab-users" label="Users">
          <AccessUsers/>
        </Tab>
        <Tab id="tab-roles" label="Roles">

        </Tab>
      </Tabs>
    </div>
  )
}

export default Access
