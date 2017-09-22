class Suggestion extends React.Component {
  render() {
    return(
      <li>
        {this.props.title}
      </li>
    );
  }
}

class Table extends React.Component {
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
          key={suggestion.id}
          title={suggestion.title}
          />
      )
    );

    return(
      <ul>
        suggestions
        {suggestions}
      </ul>
    );
  }
}


class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      values: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  saveSuggestions() {
    $.ajax({
      type: "POST",
      url: this.props.url,
      data: this.state.values,
      dataType: "JSON"
    })
      .done((data) => {
        console.log(data.message);
      })
      .fail((xhr, status, error) => {
        console.log(this.props.url, status, error.toString());
      });
  }

  handleChange(event) {
    var values = this.state.values;
    values[event.target.name] = event.target.value;
    this.setState({values: values});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.saveSuggestions();
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <p>
          Title:
          <input type="text" value={this.state.title} name="title" onChange={this.handleChange} />
        </p>
        <p>
          Description:
          <textarea value={this.state.desc} name="desc" onChange={this.handleChange}></textarea>
        </p>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


class SuggestionBox extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div>
        <Table url='http://localhost:5000/api/suggestions' />
        <Form url='http://localhost:5000/api/suggestions' />
      </div>
    );
  }
}


ReactDOM.render(
  <SuggestionBox />,
  document.getElementById('root')
);
