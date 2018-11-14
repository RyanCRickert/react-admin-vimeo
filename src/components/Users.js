import React from 'react';
import { List, Datagrid, TextField, EmailField, Create, TextInput, SimpleForm, DisabledInput } from 'react-admin';

import MyUrlField from "./Fields/MyUrlField";

export const UserList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="phone" />
      <MyUrlField source="website" />
      <TextField source="company.name" />
    </Datagrid>
  </List>
);

export const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="email" />
      <TextInput source="phone" />
      <TextInput source="website" />
      <TextInput source="company" />
    </SimpleForm>
  </Create>
);