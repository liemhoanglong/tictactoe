import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './components/board'

// const Square = (props) => {
// 	return (
// 		<button 
// 		className={"square " + (props.isWin ? "square-win" : null)} 
// 		onClick={props.onClick}
// 		>
// 		{props.value}
// 		</button>
// 	);
// }

// const size = 3
// const Board = ({winningSquares, squares, onClick}) => {
// 	const renderSquare = (i, winningSquares, squares, onClick) => {
// 		return (
// 			<Square
// 			isWin = {winningSquares.includes(i)}
// 			key={"square " + i}
// 			value={squares[i]}
// 			onClick={() => onClick(i)}
// 			/>
// 			);
// 	}
// 	const row = []
// 	let index = 0
// 	for (let i=0; i < size; i++){
// 		const sq = []
// 		for(let j = 0; j < size ; j++){
//   		sq.push(renderSquare(index, winningSquares, squares, onClick));
//   		index ++
//   	};
// 	  row.push(
// 	  	<div key = {"row " + row + 1} className="board-row">
//   		{sq}
//   		</div>
//   	)
// 	}
// 	return <div>{row}</div>
// }

const size = 3

const Game = () => {
	const [history, setHistory] = useState([{squares: Array(size*size).fill(null),}]) 
  const [stepNumber, setStepNumber] = useState(0)
  const [xIsNext, setXIsNext] = useState(true)
  const [isDes, setIsDes] = useState(true)

  const handleClick = (i) => {
		const history2 = history.slice(0, stepNumber + 1);
		const current = history2[history2.length -1]
		const squares = current.squares.slice()
		if (calculateWinner(squares) || squares[i]) {
		  return;
		}
		squares[i] = xIsNext ? 'X' : 'O';
		setHistory(history2.concat([{
			squares: squares,
			location: i+1
		}]))
		setStepNumber(history2.length)
		setXIsNext(!xIsNext)
		setIsDes(true)
  }

  const sortHistory = () => {
		setIsDes(!isDes)
  }

  const jumpTo = (step) => {
  	setStepNumber(step)
  	setXIsNext((step %2 === 0))
  }

  const loca = (move) => {
		let r = (move)/size
		let c = (move)%size  
		return ': row ' +  (Math.ceil(r) === 0 ? size : Math.ceil(r))  + ' col ' + (Math.ceil(c) === 0 ? size : Math.ceil(c))         
  }

	const current = history[stepNumber];
	const winner = calculateWinner(current.squares);
	const moves = history.map((step, move) => {
	  // console.log(history[move].location)
	  const desc = move ?
		'Go to move #' + move + loca(history[move].location) :
		'Go to game start';
	  return(
		<li key={move}>
		  <button onClick={() => jumpTo(move)}>
			{move === stepNumber ? <b>{desc}</b> : desc}
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
	  status = 'Next player: ' + (xIsNext ? 'X' : 'O'); 
	}

	return (
	  <div className="game">
			<div className="game-board">
			  <Board 
					winningSquares = {winner ? winner.line : []}
					squares={current.squares}
					onClick={i => handleClick(i)}	
			  />
			</div>
			<div className="game-info">
			  <div className="game-status">{status}</div>
			  <ol>{isDes ? moves : moves.reverse()}</ol>
			  <div>
					Sort by: {isDes ? "Asending" : "Descending"}
			  </div>
			  <label className="switch">
					<input type="checkbox" onClick={() => sortHistory()}/>
					<span className="slider round"></span>
			  </label>
			</div>
	  </div>
	);
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