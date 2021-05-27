import React from 'react';
import ReactDOM from 'react-dom';
import calculateWinner from './utils';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square 
             value={this.props.squares[i]}
             onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
        </div>
        <div className="board-row">
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const { xIsNext, stepNumber } = this.state;
    const history = this.state.history.slice(0, stepNumber + 1)
    const current = history[history.length - 1];
    const squared = current.squares.slice();
    if (calculateWinner(squared) || squared[i]) {
      return;
    }
    squared[i] = xIsNext ? 'X' : 'O';
    return this.setState({ 
      history: history.concat([{
        squares: squared,
      }]),
      stepNumber: history.length,
      xIsNext: !xIsNext,
     });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move}` : `Go to start of game`;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    let status;
    if (winner) {
      status = `The winner is ${winner}`;
    } else {
      status = `Next Player ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)