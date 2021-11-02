import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import $ from 'jquery';



// We can switch the Square component to a function that just renders directly. This still creates a component I believe, just under the hood
function Button(props) {
  // the function component just returns the DOM element to render
  return (
    // 
    // Notes on differences between class and function components
    // (1)
    //   - There is no "this" required to reference props, since this is just a function
    // (2)
    //  - For class component we write onClick={() => this.props.onClick}
    //  - For function component we write onClick={props.onClick}
    <button className="button" onClick={props.onClick}>
       {"Click Here"}
    </button>
  );
}

function Response(props) {
  // the function component just returns the DOM element to render

  return (
    <div className="response">{props.response}</div>
  );
}


class Screen extends React.Component {
  "use strict"

  constructor(props) {
    super(props);
    this.state = {response: null};
  }


  handleResponse(screen, response) {
    console.log(screen);
    console.log(this);
    console.log("setting state");

    // NOTE: If we write this method to only accept the response argument, then `this` will point at the response object. We need to pass the screen in manually. 
    screen.setState({ response: response });
    return response;
  }

  handleClick() {
    $.getJSON('https://randomuser.me/api/')
      .done((response) => this.handleResponse(this, response));
  }

  renderButton() {
    return <Button
      onClick={() => this.handleClick()}
      />;
  }

  renderResponse() {
    // console.log(this.state.response)

    var response;
    if (this.state.response) {
      console.log("defined")
      const persons = this.state.response.results.map((item, i) => (
        // NOTE: We need to wrap these within <li><\li> and add a key because of https://sentry.io/answers/unique-key-prop/
        <li key={"person_" + i}> 
        <div>
          <h1>{ item.name.first }</h1>
          <span>{ item.cell }, { item.email }</span>
        </div>
        </li>
      ));

      console.log(persons);

      response = (
        <div id="layout-content" className="layout-content-wrapper">
          <div className="panel-list">{ persons }</div>
        </div>
      );

      // response = JSON.stringify(this.state.response);
    } else {
      console.log("not defined")
      response = null;
    }

    return <Response
        response={response}
        />;
  }

  render() {
    console.log("rendering");
    return (
      <div>
        <div className="box">
          {this.renderButton()}
        </div>
        <div className="response-box">
          {this.renderResponse()}
        </div>
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Screen />,
  document.getElementById('root')
);
