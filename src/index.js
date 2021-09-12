import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const calculateWinner = (squares) => {
    const winingLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [0, 4, 8],
    ];

    for (let i = 0; i < winingLines.length; i++) {
        const [a, b, c] = winingLines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }

    return null;
}

const Square = ({ value, onClick }) =>
    <button className='square' onClick={onClick}>
        {value}
    </button>;

const Board = ({ squares, onClick }) => {
    const renderSquare = (i) =>
        <Square value={squares[i]}
            onClick={() => onClick(i)}
        />;

    const MAX_ROW = 3;
    const MAX_COLUMN = 3;

    return (
        <div className='board'>
            {[...Array(MAX_ROW)].map((_, rowIndex) =>
                <div className='board-row'>
                    {[...Array(MAX_COLUMN)].map((_, columnIndex) =>
                        renderSquare(rowIndex * MAX_ROW + columnIndex))
                    }
                </div>
            )}
        </div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handleClick(i) {
        const { history, xIsNext, stepNumber } = this.state;

        const newHistory = history.slice(0, stepNumber + 1);
        const current = newHistory[newHistory.length - 1];
        const squares = [...current.squares];

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = xIsNext ? 'X' : 'O';
        this.setState({
            history: newHistory.concat([{ squares: squares }]),
            xIsNext: !xIsNext,
            stepNumber: newHistory.length,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const { history, stepNumber, xIsNext } = this.state;

        const current = history[stepNumber];

        const moves = history.map((_, step) => {
            const desc = step ?
                `Go to #${step}` :
                'Go to game start';

            return (
                <li key={step}>
                    <button onClick={() => this.jumpTo(step)}>{desc}</button>
                </li>
            );
        })

        const winner = calculateWinner(current.squares);
        const status = (winner) ?
            `Winner: ${winner}` :
            `Next player: ${xIsNext ? 'X' : 'O'}`;

        return (
            <div className="game">
                <Board squares={current.squares}
                    onClick={(i) => this.handleClick(i)} />
                <div className="game-info">
                    <div className='status'>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

//===========================
ReactDOM.render(<Game />, document.getElementById('root'))


