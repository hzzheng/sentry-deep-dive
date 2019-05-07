import React, { Component } from 'react';

class Error extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: 's'
    };
  }

  handleClick() {
    throw new Error('Ahhhhhhhhhh!')
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        click me to throw en error
      </div>
    );
  }
}

export default Error;