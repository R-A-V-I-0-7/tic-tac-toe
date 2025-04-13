import { useState, useEffect } from 'react'
import './App.css'

// Define missing JSX namespace if needed
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Helper function to get the correct asset path
const getAssetPath = (path: string): string => {
  // Use import.meta.env.BASE_URL to handle both development and production paths
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
};

type Player = 'X' | 'O' | null;
type BoardState = Player[];
type GameHistory = { x: number; o: number; ties: number };
type GameMode = 'pvp' | 'easy' | 'medium' | 'hard';
type GameTheme = 'light' | 'dark' | 'neon';
type GameScreen = 'welcome' | 'game' | 'settings';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

function App() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistory>({
    x: 0,
    o: 0,
    ties: 0
  });
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [theme, setTheme] = useState<GameTheme>('light');
  const [moveHistory, setMoveHistory] = useState<{index: number, player: 'X' | 'O'}[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [gameMenuOpen, setGameMenuOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('welcome');
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false);
  const [showFeaturesPopup, setShowFeaturesPopup] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    checkGameState();
    
    // AI move if it's computer's turn
    if (isGameStarted && currentPlayer === 'O' && gameMode !== 'pvp' && !winner && !isDraw) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, gameMode, isGameStarted]);

  const startGame = () => {
    setCurrentScreen('game');
    setIsGameStarted(true);
    resetGame();
    // Log to console for debugging
    console.log("Game started, screen changed to:", 'game');
  };

  const goToHome = () => {
    setShowHomeConfirmation(true);
  };

  const confirmGoToHome = () => {
    setCurrentScreen('welcome');
    setShowHomeConfirmation(false);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
    setMoveHistory([]);
    setIsGameStarted(false);
    setGameMenuOpen(false);
    setConfettiActive(false);
  };

  const cancelGoToHome = () => {
    setShowHomeConfirmation(false);
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || isDraw || !isGameStarted) return;

    // Player's move
    makeMove(index);
  };

  const makeMove = (index: number) => {
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    // Add to move history
    setMoveHistory(prev => [...prev, {index, player: currentPlayer}]);
    
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const makeAIMove = () => {
    if (winner || isDraw) return;

    let bestMove: number;

    switch (gameMode) {
      case 'easy':
        bestMove = getRandomMove();
        break;
      case 'medium':
        // 50% chance of making a smart move
        bestMove = Math.random() > 0.5 ? getSmartMove() : getRandomMove();
        break;
      case 'hard':
        bestMove = getSmartMove();
        break;
      default:
        return;
    }

    if (bestMove !== undefined && bestMove !== -1) {
      makeMove(bestMove);
    }
  };

  const getRandomMove = (): number => {
    const availableMoves = board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[];
    
    if (availableMoves.length === 0) return -1;
    
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  };

  const getSmartMove = (): number => {
    // Simple minimax implementation
    const availableMoves = board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[];
    
    if (availableMoves.length === 0) return -1;

    // If there's a winning move, take it
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = 'O';
      
      for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (boardCopy[a] && boardCopy[a] === boardCopy[b] && boardCopy[a] === boardCopy[c]) {
          return move;
        }
      }
    }
    
    // If player can win on next move, block it
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = 'X';
      
      for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (boardCopy[a] && boardCopy[a] === boardCopy[b] && boardCopy[a] === boardCopy[c]) {
          return move;
        }
      }
    }
    
    // Take center if available
    if (board[4] === null) {
      return 4;
    }
    
    // Take a corner
    const corners = [0, 2, 6, 8].filter(corner => board[corner] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }
    
    // Take what's available
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const checkGameState = () => {
    // Check for winner
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningCells(combo);
        updateGameHistory(board[a]);
        
        // Trigger confetti for winner
        if (board[a] === 'X') {
          setConfettiActive(true);
          setTimeout(() => setConfettiActive(false), 3000);
        }
        
        return;
      }
    }

    // Check for draw
    if (!board.includes(null) && !winner) {
      setIsDraw(true);
      updateGameHistory(null);
    }
  };

  const updateGameHistory = (winner: Player) => {
    setGameHistory((prev: GameHistory) => {
      if (winner === 'X') return { ...prev, x: prev.x + 1 };
      if (winner === 'O') return { ...prev, o: prev.o + 1 };
      return { ...prev, ties: prev.ties + 1 };
    });
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
    setMoveHistory([]);
    setIsGameStarted(true);
    setGameMenuOpen(false);
    setConfettiActive(false);
  };

  const undoLastMove = () => {
    if (moveHistory.length === 0 || winner || isDraw) return;
    
    const newHistory = [...moveHistory];
    const lastMove = newHistory.pop();
    
    if (lastMove) {
      setMoveHistory(newHistory);
      
      const newBoard = [...board];
      newBoard[lastMove.index] = null;
      setBoard(newBoard);
      
      setCurrentPlayer(lastMove.player);
    }
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  const handleThemeChange = (newTheme: GameTheme) => {
    setTheme(newTheme);
  };

  const toggleRulesPopup = () => {
    setShowRulesPopup(!showRulesPopup);
  };
  
  const toggleFeaturesPopup = () => {
    setShowFeaturesPopup(!showFeaturesPopup);
  };

  const renderCell = (index: number) => {
    const isWinningCell = winningCells.includes(index);
    const cellValue = board[index];
    const isEmpty = cellValue === null;
    const isPlayable = isEmpty && !winner && !isDraw && isGameStarted;

    return (
      <div 
        className={`cell ${cellValue ? `cell-${cellValue.toLowerCase()}` : ''} 
                  ${isWinningCell ? 'winning-cell' : ''} 
                  ${isPlayable ? 'cell-playable' : ''}
                  ${isEmpty ? 'cell-empty' : ''}`}
        onClick={() => handleCellClick(index)}
      >
        {cellValue && <span className="cell-content">{cellValue}</span>}
        {isPlayable && <span className="cell-hover-overlay"></span>}
      </div>
    );
  };

  const renderGameMenu = () => (
    <div className={`game-menu ${gameMenuOpen ? 'open' : ''}`}>
      <h2>Game Settings</h2>
      <button className="close-settings" onClick={() => setGameMenuOpen(false)}>×</button>
      
      <div className="menu-section">
        <h3>Choose Game Mode</h3>
        <div className="mode-buttons">
          <button 
            className={`mode-button ${gameMode === 'pvp' ? 'active' : ''}`}
            onClick={() => handleGameModeChange('pvp')}
          >
            Player vs Player
          </button>
          <button 
            className={`mode-button ${gameMode === 'easy' ? 'active' : ''}`}
            onClick={() => handleGameModeChange('easy')}
          >
            Computer (Easy)
          </button>
          <button 
            className={`mode-button ${gameMode === 'medium' ? 'active' : ''}`}
            onClick={() => handleGameModeChange('medium')}
          >
            Computer (Medium)
          </button>
          <button 
            className={`mode-button ${gameMode === 'hard' ? 'active' : ''}`}
            onClick={() => handleGameModeChange('hard')}
          >
            Computer (Hard)
          </button>
        </div>
      </div>
      
      <div className="menu-section">
        <h3>Choose Theme</h3>
        <div className="theme-buttons">
          <button 
            className={`theme-button light ${theme === 'light' ? 'active' : ''}`}
            onClick={() => handleThemeChange('light')}
          >
            Light
          </button>
          <button 
            className={`theme-button dark ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => handleThemeChange('dark')}
          >
            Dark
          </button>
          <button 
            className={`theme-button neon ${theme === 'neon' ? 'active' : ''}`}
            onClick={() => handleThemeChange('neon')}
          >
            Neon
          </button>
        </div>
      </div>
      
      <button className="start-game" onClick={resetGame}>
        Start Game
      </button>
    </div>
  );

  const renderHomeConfirmation = () => {
    if (!showHomeConfirmation) return null;
    
    return (
      <div className="popup-overlay">
        <div className="home-confirmation">
          <h3>Return to Home?</h3>
          <p>Your current game progress will be lost.</p>
          <div className="confirmation-buttons">
            <button onClick={confirmGoToHome} className="confirm-button">
              <span>Yes, Go Home</span>
            </button>
            <button onClick={cancelGoToHome} className="cancel-button">
              <span>No, Continue</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFeaturesPopup = () => (
    <div className={`features-popup ${showFeaturesPopup ? 'open' : ''}`}>
      <div className="features-popup-content">
        <button className="close-features" onClick={toggleFeaturesPopup}>×</button>
        <h2 className="features-popup-title">Game Features & Modes</h2>
        
        <h3 className="features-popup-subtitle">Game Modes</h3>
        <div className="modes-info popup-section">
          <div className="rules-grid">
            <div className="rule-item">
              <div className="rule-number">1</div>
              <div className="rule-text">
                <strong>Player vs Player:</strong> Challenge a friend on the same device
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-number">2</div>
              <div className="rule-text">
                <strong>Easy AI:</strong> Computer makes random moves, perfect for beginners
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-number">3</div>
              <div className="rule-text">
                <strong>Medium AI:</strong> Computer occasionally makes strategic moves
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-number">4</div>
              <div className="rule-text">
                <strong>Hard AI:</strong> Computer always makes the best strategic move
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="features-popup-subtitle">Special Features</h3>
        <div className="features-list popup-section">
          <div className="feature-item popup-feature">
            <div className="feature-icon">🎨</div>
            <div className="feature-title">Multiple Themes</div>
            <div>Choose between Light, Dark, and Neon themes</div>
          </div>
          <div className="feature-item popup-feature">
            <div className="feature-icon">🏆</div>
            <div className="feature-title">Score Tracking</div>
            <div>Keep track of wins, losses, and ties</div>
          </div>
          <div className="feature-item popup-feature">
            <div className="feature-icon">↩️</div>
            <div className="feature-title">Undo Moves</div>
            <div>Made a mistake? Undo your last move</div>
          </div>
          <div className="feature-item popup-feature">
            <div className="feature-icon">🎉</div>
            <div className="feature-title">Celebrations</div>
            <div>Enjoy confetti celebrations when you win</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWelcomeScreen = () => (
    <div className="welcome-screen">
      <h1>Tic Tac Toe</h1>
      <p>A modern twist on the classic game with multiple game modes, themes, and exciting features!</p>
      
      <div className="welcome-actions">
        <button 
          className="start-button" 
          onClick={startGame}
        >
          Play Now
        </button>
        
        <div className="secondary-actions">
          <button 
            className="info-button rules-info-button" 
            onClick={toggleRulesPopup}
          >
            Game Rules
          </button>
          <button 
            className="info-button features-info-button" 
            onClick={toggleFeaturesPopup}
          >
            Features & Modes
          </button>
        </div>
      </div>
    </div>
  );

  const renderRulesPopup = () => (
    <div className={`rules-popup ${showRulesPopup ? 'open' : ''}`}>
      <div className="rules-popup-content">
        <button className="close-rules" onClick={toggleRulesPopup}>×</button>
        <h2 className="rules-popup-title">How to Play</h2>
        <div className="rules-popup-list popup-section">
          <div className="rules-grid">
            <div className="rule-item">
              <div className="rule-number">1</div>
              <div className="rule-text">
                Players take turns placing their mark (X or O) on an empty square
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-number">2</div>
              <div className="rule-text">
                The first player to get 3 marks in a row (horizontally, vertically, or diagonally) wins
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-number">3</div>
              <div className="rule-text">
                If all squares are filled with no winner, it's a draw
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-number">4</div>
              <div className="rule-text">
                X always goes first in a new game, followed by O
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-number">5</div>
              <div className="rule-text">
                In single-player mode, you play as X against the computer
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfetti = () => {
    if (!confettiActive) return null;
    
    return (
      <div className="confetti-container">
        {Array(50).fill(null).map((_, i) => (
          <div 
            key={i} 
            className="confetti" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`
            }}
          />
        ))}
      </div>
    );
  };

  const renderGameControls = () => {
    return (
      <div className="game-controls">
        <button onClick={() => setGameMenuOpen(true)} className="control-button">
          <span>Settings</span>
        </button>
        <button onClick={resetGame} className="control-button">
          <span>New Game</span>
        </button>
        <button 
          onClick={undoLastMove} 
          className="control-button"
          disabled={moveHistory.length === 0 || winner !== null || isDraw}
        >
          <span>Undo</span>
        </button>
        <button onClick={goToHome} className="control-button">
          <span>Home</span>
        </button>
      </div>
    );
  };

  const renderGameStatus = () => {
    if (!isGameStarted) {
      return <div className="start-prompt">Choose settings and start a game</div>;
    } else if (winner) {
      return (
        <div className="winner-message">
          {gameMode !== 'pvp' && winner === 'X' ? 'You win!' : gameMode !== 'pvp' && winner === 'O' ? 'Computer wins!' : 
          `Player ${winner} wins!`}
        </div>
      );
    } else if (isDraw) {
      return <div className="draw-message">It's a draw!</div>;
    } else {
      return (
        <div className="current-player">
          {gameMode !== 'pvp' && currentPlayer === 'X' ? 'Your turn' : 
          gameMode !== 'pvp' && currentPlayer === 'O' ? 'Computer is thinking...' : 
          `Player ${currentPlayer}'s turn`}
        </div>
      );
    }
  };

  return (
    <div className={`game-container theme-${theme}`}>
      {currentScreen === 'welcome' && renderWelcomeScreen()}
      {renderRulesPopup()}
      {renderFeaturesPopup()}
      
      {currentScreen === 'game' && (
        <>
          {renderConfetti()}
          {renderGameMenu()}
          {renderGameControls()}
          
          <h1 className="game-title">Tic Tac Toe</h1>
          
          <div className="game-status">{renderGameStatus()}</div>
          
          <div className="game-board">
            {Array(9).fill(null).map((_, index) => renderCell(index))}
          </div>

          <div className="game-history">
            <div className="history-item x-wins">
              <span className="player-label player-x">
                {gameMode !== 'pvp' ? 'You' : 'X'}
              </span>
              <span className="score">{gameHistory.x}</span>
            </div>
            <div className="history-item ties">
              <span className="player-label">Ties</span>
              <span className="score">{gameHistory.ties}</span>
            </div>
            <div className="history-item o-wins">
              <span className="player-label player-o">
                {gameMode !== 'pvp' ? 'CPU' : 'O'}
              </span>
              <span className="score">{gameHistory.o}</span>
            </div>
          </div>

          <button className="rules-button" onClick={toggleRulesPopup}>
            ?
          </button>
        </>
      )}
      {renderHomeConfirmation()}
    </div>
  );
}

export default App
