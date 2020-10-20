import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './components/board'

// const size = 3

const Game = () => {
  const [size, setSize] = useState(3);
	const [history, setHistory] = useState([{squares: Array(size*size).fill(null),}]) 
  const [stepNumber, setStepNumber] = useState(0)
  const [xIsNext, setXIsNext] = useState(true)
  const [isDes, setIsDes] = useState(true)


  const handleClick = (i) => {
		const history2 = history.slice(0, stepNumber + 1);
		const current = history2[history2.length -1]
		const squares = current.squares.slice()
		if (calculateWinner(squares, size) || squares[i]) {
		  return;
		}
		squares[i] = xIsNext ? 'X' : 'O';
		setHistory(history2.concat([{
			squares: squares,
			location: i
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
		let r = Math.floor((move)/size) + 1
		let c = Math.floor((move)%size) + 1  
		return ': row ' +  r + ' col ' + c        
  }

	const current = history[stepNumber];
	const winner = calculateWinner(current.squares, size);
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
			<form className="input-size">
				<label htmlFor="size">Board size: </label>
  			<input type="number" id="size" name="size" onChange={(event) => setSize(event.target.value)}/>
	    </form>

			<div className="game-board">
			  <Board 
					winningSquares = {winner ? winner.line : []}
					squares={current.squares}
					onClick={i => handleClick(i)}	
					size={size}
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

const location = (move, size) => {
	let r = Math.floor((move)/size)+1
	let c = Math.floor((move)%size)+1  
	return [r, c]          
}

//Declaring a Winner
function calculateWinner(squares, size) {
	console.log(squares)

	if (size <= 3) {
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
	} else if (size < 5){
		const lines = [
		[0, 1, 2, 3],
		[4, 5, 6, 7],
		[8, 9, 10, 11],
		[12, 13, 14, 15],
		[0, 5, 10, 15],
		[3, 6, 9, 12],
		[0, 4, 8, 12],
		[1, 5, 9, 13],
		[2, 6, 10, 14],
		[3, 7, 11, 15]
	  ];
	  for (let i = 0; i < lines.length; i++) {
	  	const [a, b, c, d] = lines[i];
	  	if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
	  		return { player: squares[a], line: [a, b, c, d] };
	  	}
	  }
	} else {
		
	}
  
  return null;
}