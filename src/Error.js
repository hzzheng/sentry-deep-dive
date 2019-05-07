import React, { Component } from 'react';

class Error extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: 's'
    };
  }

  handleClick() {
    const { name2 } = this.state

    this.setState({
      name: name2.evil + 1
    })
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