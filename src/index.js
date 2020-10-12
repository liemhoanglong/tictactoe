import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className={"square " + (props.isWin ? "square-win" : null)} 
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
  	//create prop value
    return (
      <Square
        isWin = {this.props.winningSquares.includes(i)}
        key={"square " + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(row){
    const sq = [];
    const index = row * 3;
    for(let s = 0; s < 3 ; s++){
      sq.push(this.renderSquare(index + s));
    };
    return (
      <div key = {"row " + row + 1} className="board-row">
        {sq}
      </div>
    )
  }

  render() {
    const row = [];
    for (let i=0; i<3; i++){
      row.push(this.renderRow(i))
    }
    return <div>{row}</div>
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history  = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i+1
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      isDes: true,
    });
  }

  sortHistory(){
    this.setState({isDes: !this.state.isDes})
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  loca(move) {
    let r = (move)/3
    let c = (move)%3  
    return ': row ' +  (Math.ceil(r) === 0 ? 3 : Math.ceil(r))  + ' col ' + (Math.ceil(c) === 0 ? 3 : Math.ceil(c))         
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      console.log(history[move].location)
      const desc = move ?
        'Go to move #' + move + this.loca(history[move].location) :
        'Go to game start';
      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>  
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else if (!current.squares.includes(null)) {
      status = "Draw"; 
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); 
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winningSquares = {winner ? winner.line : []}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="game-status">{status}</div>
          <ol>{this.state.isDes ? moves : moves.reverse()}</ol>
          <div>
            Sort by: {this.state.isDes ? "Asending" : "Descending"}
          </div>
          <label className="switch">
            <input type="checkbox" onClick={() => this.sortHistory()}/>
            <span className="slider round"></span>
          </label>
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

//Declaring a Winner
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}