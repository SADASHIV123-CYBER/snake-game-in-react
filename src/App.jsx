import { useState, useEffect } from "react";
import "./App.css";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (DIRECTIONS[e.key]) setDirection(DIRECTIONS[e.key]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver]);

  return (
    <div className="game-container">
      <h1>Snake Game</h1>
      <p className="developer-name">Developed by Sadashiv 🚀</p>
      {gameOver && <h2 className="game-over">Game Over! Refresh to Restart</h2>}
      <div className="board">
        {Array.from({ length: BOARD_SIZE }).map((_, y) => (
          <div key={y} className="row">
            {Array.from({ length: BOARD_SIZE }).map((_, x) => {
              const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;
              return <div key={x} className={`cell ${isSnake ? "snake" : isFood ? "food" : ""}`} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default App;
