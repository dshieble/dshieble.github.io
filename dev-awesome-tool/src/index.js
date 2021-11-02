import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {

//   render() {
//     return (
//       // DOM button element, onClick is a reserved method
//       <button className="square" 
//         // lambda syntax
//         onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// We can switch the Square component to a function that just renders directly. This still creates a component I believe, just under the hood
function Square(props) {
  // the function component just returns the DOM element to render
  return (
    // 
    // Notes on differences between class and function components
    // (1)
    //   - There is no "this" required to reference props, since this is just a function
    // (2)
    //  - For class component we write onClick={() => this.props.onClick}
    //  - For function component we write onClick={props.onClick}
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };
  }


  handleClick(i) {
    // copy the squares attribute
    const squares = this.state.squares.slice();

    // Don't do anything if there is already a winner or this square is already taken
    if (!calculateWinner(squares) && !squares[i]) {
      // edit the cop/y
      squares[i] = this.state.xIsNext ? 'X' : 'O';

      // Set the this.state attribute manually with a setter. This is based on good React practice (don't mutate properties directly)
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
      })
    }
  }

  renderSquare(i) {
    return <Square
      value={this.state.squares[i]}
      // this is just the name of the method that we are creating Square with, this does not need to be called onClick
      onClick={() => this.handleClick(i)}
      />;
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
