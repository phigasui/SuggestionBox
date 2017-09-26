import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import { Button, IconButton } from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox';
import Input from 'react-toolbox/lib/input';
import {
  Card, CardMedia, CardTitle, CardText, CardActions
} from 'react-toolbox/lib/card';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';


class Suggestion extends Component {
  render() {
    return(
      <Card style={{width: '350px'}}>
        <CardTitle title={this.props.title} />
        <CardText>{this.props.desc}</CardText>
        <CardActions>
          <IconButton icon='favorite' />
        </CardActions>
      </Card>
    );
  }
}

class Table extends Component {
  constructor() {
    super();
    this.state = {
      suggestions: []
    };
  }

  componentDidMount() {
    this.getSuggestions();
  }

  getSuggestions() {
    $.ajax({
      type: "GET",
      url: this.props.url
    })
      .done((data) => {
        this.setState({suggestions: data.data});
        console.log(data.message);
      })
      .fail((xhr, status, error) => {
        console.log(this.props.url, status, error.toString());
      });
  }

  render() {
    const suggestions = this.state.suggestions.map(
      (suggestion) => (
        <Suggestion
          key={suggestion._id.$oid}
          title={suggestion.title}
          desc={suggestion.description}
          />
      )
    );

    return(
      <section>
        <h2>Suggestions</h2>
        {suggestions}
      </section>
    );
  }
}


class Form extends Component {
  constructor() {
    super();
    this.state = {
      values: {
        title: '',
        desc: ''
      },
      submitted: false,
      failed: false,
      failed_message: ''
    };
  }

  saveSuggestions() {
    $.ajax({
      type: "POST",
      url: this.props.url,
      data: this.state.values,
      dataType: "JSON"
    })
      .done((data) => {
        this._submitComplete();
        console.log(data.message);
      })
      .fail((xhr, status, error) => {
        console.log(this.props.url, status, error.toString());
      });
  }

  _submitComplete() {
    this.setState({ submitted: true });
  }

  handleChange(name, value) {
    values = this.state.values;
    values[name] = value;
    this.setState({ values: values });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.saveSuggestions();
  }

  handleSnackbarClick(event, instance) {
    this.setState({ submitted: false });
  }

  handleSnackbarTimeout(event, instance) {
    this.setState({ submitted: false });
  }

  render() {
    console.log(this.state.values);
    return(
      <section style={{width: '350px'}}>
        <h2>New Suggestion</h2>
        <div>
          <Input
            type='text'
            label='Title'
            name='title'
            value={this.state.values.title}
            onChange={this.handleChange.bind(this, 'title')}
            maxLength={16}
            />
          <Input
            type='text'
            multiline
            label='Description'
            name='desc'
            value={this.state.values.desc}
            onChange={this.handleChange.bind(this, 'desc')}
            maxLength={300}
            />
        </div>
        <Button
          label="Submit"
          onClick={this.handleSubmit.bind(this)}
          raised primary
          />
        <Snackbar
          action='Submit'
          active={this.state.submitted}
          label='Suggestion submitted'
          timeout={2000}
          onClick={this.handleSnackbarClick.bind(this)}
          onTimeout={this.handleSnackbarTimeout.bind(this)}
          type='accept'
          />
        <Snackbar
          action='Failed'
          active={this.state.failed}
          label={this.state.failed_message}
          timeout={2000}
          onClick={this.handleSnackbarClick.bind(this)}
          onTimeout={this.handleSnackbarTimeout.bind(this)}
          type='accept'
          />
      </section>
    );
  }
}


class SuggestionBox extends Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div>
        <AppBar title='Suggestion Box' leftIcon='menu'>
          <Navigation type='horizontal'>
            <Button icon='inbox' label='inbox' raised />
            <Button icon='person' label='inbox' raised />
          </Navigation>
        </AppBar>
        <Form url='http://localhost:5000/api/suggestions' />
        <Table url='http://localhost:5000/api/suggestions' />
      </div>
    );
  }
}


ReactDOM.render(
  <SuggestionBox />,
  document.getElementById('root')
);
