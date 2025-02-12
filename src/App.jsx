import { useState, useEffect } from "react";
import "./App.css";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const INITIAL_SPEED = 200; // Starting speed (lower = faster)
const SPEED_INCREMENT = 10; // Decrease interval by 10ms on each food eaten
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(true);

  // Mobile Touch Controls
  const handleDirectionChange = (dir) => {
    setDirection(DIRECTIONS[dir]);
  };

  // Restart Game
  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) });
    setDirection(DIRECTIONS.RIGHT);
    setGameOver(false);
    setSpeed(INITIAL_SPEED);
    setRunning(true);
  };

  useEffect(() => {
    if (gameOver || !running) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check for collisions
        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          setRunning(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if the snake eats food
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
          });

          // Increase speed (decrease interval time)
          setSpeed((prevSpeed) => Math.max(50, prevSpeed - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, running, speed]);

  return (
    <div className="game-container">
      <h1>🐍 Speedy Snake Game 🎮</h1>
      <p className="developer-name">Developed by Sadashiv 🚀</p>
      {gameOver && <h2 className="game-over">Game Over!</h2>}
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

      {/* Mobile Touch Controls */}
      <div className="controls">
        <button className="control-btn up" onClick={() => handleDirectionChange("UP")}>▲</button>
        <div className="middle-controls">
          <button className="control-btn left" onClick={() => handleDirectionChange("LEFT")}>◀</button>
          <button className="control-btn right" onClick={() => handleDirectionChange("RIGHT")}>▶</button>
        </div>
        <button className="control-btn down" onClick={() => handleDirectionChange("DOWN")}>▼</button>
      </div>

      {/* Restart Button */}
      {gameOver && <button className="restart-btn" onClick={restartGame}>🔄 Restart Game</button>}
    </div>
  );
}

export default App;
