import React, { Component } from 'react';

class Error extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: 's'
    };
  }
  render() {
    return (
      <div>error</div>
    );
  }
}

export default Error;