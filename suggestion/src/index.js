import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import { Button, IconButton, Snackbar } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import {
  Card, CardMedia, CardTitle, CardText, CardActions
} from 'react-toolbox/lib/card';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Link from 'react-toolbox/lib/Link';
import FontIcon from 'react-toolbox/lib/font_icon';


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
      title: '',
      desc: '',
      submit: false
    };
  }

  saveSuggestions() {
    $.ajax({
      type: "POST",
      url: this.props.url,
      data: this.state,
      dataType: "JSON"
    })
      .done((data) => {
        console.log(data.message);
      })
      .fail((xhr, status, error) => {
        console.log(this.props.url, status, error.toString());
      });
  }

  handleChange(name, value) {
    this.setState({...this.state, [name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submit: true });
    this.saveSuggestions();
  }

  handleSnackbarClick() {
    this.setState({ submit: false });
  }

  handleSnackbarTimeout() {
    this.setState({ submit: false });
  }

  render() {
    return(
      <section>
        <h2>New Suggestion</h2>
        <div>
          <Input type='text' label='Title' name='title'
                 value={this.state.title}
                 onChange={this.handleChange.bind(this, 'title')}
                 maxLength={16} />
          <Input type='text' multiline label='Description' name='desc'
                 value={this.state.desc}
                 onChange={this.handleChange.bind(this, 'desc')}
                 maxLength={300} />
        </div>
        <Button label="Submit" onClick={this.handleSubmit.bind(this)}
                raised primary />
        {/* <Snackbar
                action='Submitted'
                active={this.state.submit}
                label='Suggestion submitted'
                timeout={2000}
                onClick={this.handleSnackbarClick}
                onTimeout={this.handleSnackbarTimeout}
                type='accept'
              /> */}
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
            <FontIcon value='add' />
            <Link href='http://' label='Inbox' icon='inbox' />
            <Link href='http://' active label='Profile' icon='person' />
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
