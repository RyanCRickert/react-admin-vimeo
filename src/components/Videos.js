import React from 'react';
import { List, Datagrid, TextField, Create, TextInput, SimpleForm, ReferenceInput, SelectInput, DisabledInput, ReferenceField, FileField, FileInput, Edit, required } from 'react-admin';
import { Form, FormGroup, FormText, Input, Label } from "reactstrap";
import { post } from "axios";
import firebase from "firebase";

import { MyVideoCreateActions } from "../actions/FileCreateActions";

const VideoTitle = ({ record }) => {
  return <span>Video {record ? `"${record.videoName}"` : ''}</span>;
};

export class VideoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <List {...this.props}>
        <Datagrid rowClick="edit">
          <TextField source="videoName" />
          <TextField source="videoDescription" />
        </Datagrid>
      </List>
    )
  }

};

export class VideoCreate extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      videoName : "",
      videoDescription : "",
      videoFile: undefined,
      vimeoURI: "First upload to Vimeo",
      message: "Click here to upload to Vimeo when ready",
      buttonReady: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
    this.test = this.test.bind(this)
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleFileChange(e) {
    this.setState({ videoFile: e.rawFile});
  }

  uploadVideoVimeo = () => {
    const formData = new FormData();

    formData.append('file', this.state.videoFile);
    formData.set("name", this.state.videoName);
    formData.set("description", this.state.videoDescription);
    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
  }
    return post("/upload", formData, config)
  }

  test() {
    console.log("Test")
  }

  uploadVideoFirebase(item) {
    return firebase.storage().ref().child("videos/" + item.videoName).put(item.videoFile)
    .then((snapshot) => {
        console.log('One success:', snapshot.downloadURL)
        return snapshot.downloadURL;
    }).catch((error) => {
        console.log('One failed:', item, error.message);
        return error;
    });
  }

  componentWillMount() {

  }

  buttonClick(e) {
    e.preventDefault();
    
    this.setState({ message: "Uploading video to Vimeo"})
    this.uploadVideoVimeo()
    .then((response) => this.setState({ vimeoURI: response.data.slice(8), message: "Upload to Vimeo complete, uploading to Firestore" }))
    .then(() => this.uploadVideoFirebase(this.state))
    .then(() => this.setState({ message: "Uploads complete, ready to save to database", buttonReady : true}));
  }

  render() {
    return (
      <Create {...this.props}>
      <SimpleForm onSubmit={this.test}>
        <DisabledInput source="vimeoURI" defaultValue={this.state.vimeoURI}/>
        <TextInput source="videoName" validate={required()} onChange={this.handleChange}/>
        <TextInput source="videoDescription" validate={required()} onChange={this.handleChange}/>
        <FileInput source="files" label="Related files" accept="video/*" onChange={this.handleFileChange}>
          <FileField source="src" title="title" />
        </FileInput>
        <button className={this.state.buttonReady ? "button-ready" : "button-not-ready"} disabled={!this.state.videoName || !this.state.videoDescription || !this.state.videoFile} onClick={this.buttonClick}>{this.state.message}</button>
      </SimpleForm>
    </Create>
    )
  }
};

export const VideoEdit = props => (
  <Edit title={<VideoTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="vimeoURI" />
      <TextInput source="videoName" />
      <TextInput source="videoDescription" />
      </SimpleForm>
  </Edit>
);