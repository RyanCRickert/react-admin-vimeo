import Button from '@material-ui/core/Button';
import { CardActions, ShowButton } from 'react-admin';
import React from "react";

function customAction(props) {
  console.log(props)
}

export const MyVideoCreateActions = ({ basePath, data, resource }) => (
    <CardActions>
        <ShowButton basePath={basePath} record={data} />
        {  }
        <Button color="primary" onClick={customAction(this.props.file)}>Upload to Vimeo</Button>
    </CardActions>
);