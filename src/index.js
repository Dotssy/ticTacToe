import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight' : '');
  return (
    <button className={className} onClick={props.onClick} id={props.squareId}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winLine = this.props.winLine;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        highlight={winLine && winLine.includes(i)}
      />
    );
  }

  renderGrid() {
    let grid = [];
    let idx = 0;
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(idx));
        idx++;
      }
      grid.push(<div className="board-row" key={`row${i}`}>{row}</div>);
    }
    return grid;
  }

  render() {
    return (
      <div>
        {this.renderGrid()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: 0,
        col: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      listIsReversed: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares).symbol;

    if (winner || squares[i]) {
      return;
    }

    const row = calculatePosition(i).row;
    const col = calculatePosition(i).col;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        row: row,
        col: col,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseTurns() {
   this.setState({
     listIsReversed: !this.state.listIsReversed,
   });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winInfo = calculateWinner(current.squares);
    const winner = winInfo.symbol;

    const moves = history.map((step, move) => {
      const turnPos = {
        row: history[move].row,
        col: history[move].col,
      };
      const desc = move ?
        `Return to move #${move}` :
        `Return to game start`;
      const bold = move + 1 === history.length ? "bold" : "";
      return (
          <li key={move} className={bold}>
            {(move < 1) ? `${move}. Game start` : `${move}. Turn position: row: ${turnPos.row} col: ${turnPos.col}`}
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else if (!winner && history.length > 9) {
      status = "The game is draw";
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winInfo.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="reverse-moves-btn" onClick={() => this.reverseTurns()}>Sort Moves List</button>
          <ul>{this.state.listIsReversed ? moves.reverse() : moves}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) { // Returns object with winning symbol and win line coords
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
  const winner = {
    symbol: null,
    line: null,
  };
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winner.symbol = squares[a];
      winner.line = lines[i];
    }
  }
  return winner;
}

function calculatePosition(i) {
  const position = {};
  switch (i) {
    case 0:
      position.row = 1;
      position.col = 1;
      break;
    case 1:
      position.row = 1;
      position.col = 2;
      break;
    case 2:
      position.row = 1;
      position.col = 3;
      break;
    case 3:
      position.row = 2;
      position.col = 1;
      break;
    case 4:
      position.row = 2;
      position.col = 2;
      break;
    case 5:
      position.row = 2;
      position.col = 3;
      break;
    case 6:
      position.row = 3;
      position.col = 1;
      break;
    case 7:
      position.row = 3;
      position.col = 2;
      break;
    case 8:
      position.row = 3;
      position.col = 3;
      break;
    default:
      position.row = 0;
      position.col = 0;
  }
  return position;
}