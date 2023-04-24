const gameboard = (() => {
  let layout = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const getLayout = () => {
    return layout;
  }

  const setLayout = (index, mark) => {
    layout[index] = mark;
  }

  const resetLayout = () => {
    layout = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  const getMark = index => {
    return layout[index];
  }

  return { getLayout, setLayout, resetLayout, getMark }
})()

const Player = mark => {
  this.mark = mark;

  const getMark = () => {
    return mark;
  }

  return { getMark }
}

const displayController = (() => {
  const select = document.querySelector('select');
  const plays = document.querySelectorAll('.play');
  const playX = document.querySelector('button[value="X"]');
  const playO = document.querySelector('button[value="O"]');
  const turn = document.querySelector('.turn');
  const turnMark = document.querySelector('.container-turn>span');
  const tiles = document.querySelectorAll('.tile');
  const restart = document.querySelector('.restart');

  select.addEventListener('change', e => {
    changeGamemode(e.target.value);
    resetGame();
  });

  plays.forEach(play => play.addEventListener('click', e => {
    changeMode(e.target.value);
    resetGame();
  }));

  tiles.forEach(tile => tile.addEventListener('click', e => placeMark(e.target)));

  restart.addEventListener('click', () => resetGame());

  const changeGamemode = gamemode => {
    gameController.setGamemode(gamemode);
    if (gamemode === 'friend') {
      plays.forEach(play => play.setAttribute('disabled', ''));
    } else {
      playX.setAttribute('disabled', '');
      playO.removeAttribute('disabled');
    }
    gameController.setComputerPlaysFirst(false);
    gameController.setDifficulty(gamemode);
  }

  const changeMode = mode => {
    if (mode === 'X') {
      playX.toggleAttribute('disabled');
      playO.toggleAttribute('disabled');
      gameController.setComputerPlaysFirst(false);
    } else {
      playO.toggleAttribute('disabled');
      playX.toggleAttribute('disabled');
      gameController.setComputerPlaysFirst(true);
    }
  }

  const resetGame = () => {
    tiles.forEach(tile => {
      tile.textContent = '';
      tile.removeAttribute('disabled');
      tile.className = 'tile';
    });
    gameboard.resetLayout();
    gameController.resetGame();
    updateTurn();
  }

  const placeMark = tile => {
    tile.setAttribute('disabled', '');
    tile.textContent = gameController.getCurrentPlayerMark();
    if (tile.textContent === 'X') {
      tile.classList.add('mark-X');
    } else {
      tile.classList.add('mark-O');
    }
    gameboard.setLayout(parseInt(tile.value), gameController.getCurrentPlayerMark());
    if (gameController.hasPlayerWon(gameboard.getLayout(), gameController.getCurrentPlayerMark())) {
      declareWinner();
      disableBoard();
      return;
    } else if (gameController.getEmptySpaces(gameboard.getLayout()).length === 0) {
      declareDraw();
      disableBoard();
      return;
    }
    gameController.toggleCurrentPlayer();
    updateTurn();
    if (gameController.getGamemode() !== 'friend') {
      if (gameController.getCurrentPlayer() === 'computer') {
        gameController.makeComputerMove();
      }
    }
  }

  const updateTurnMark = () => {
    if (turnMark.textContent === 'X') {
      turnMark.className = 'mark-X';
    } else {
      turnMark.className = 'mark-O';
    }
  }

  const updateTurn = () => {
    console.log(gameController.getCurrentPlayerMark());
    turnMark.textContent = `${gameController.getCurrentPlayerMark()}`;
    updateTurnMark();
    turn.textContent = ' Turn';
  }

  const declareWinner = () => {
    turnMark.textContent = '';
    turnMark.textContent = `${gameController.getCurrentPlayerMark()}`;
    updateTurnMark();
    turn.textContent = ` wins!`;
  }

  const declareDraw = () => {
    turnMark.textContent = '';
    turn.textContent = 'Draw!';
  }

  const disableBoard = () => {
    tiles.forEach(tile => tile.setAttribute('disabled', ''));
  }

  return { placeMark }
})()

const gameController = (() => {
  let gamemode = 'easy';
  let playerX = Player('X');
  let playerO = Player('O');
  let human = playerX;
  let computer = playerO;
  let computerPlaysFirst = false;
  let currentPlayer = human;
  let difficulty = 25;
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const setGamemode = gm => {
    gamemode = gm;
  }

  const getGamemode = () => {
    return gamemode;
  }

  const setComputerPlaysFirst = value => {
    computerPlaysFirst = value;
  }

  const getCurrentPlayer = () => {
    return currentPlayer === human ? 'human' : 'computer';
  }

  const getCurrentPlayerMark = () => {
    return currentPlayer.getMark();
  }

  const toggleCurrentPlayer = () => {
    if (gamemode === 'friend') {
      currentPlayer === playerX ? currentPlayer = playerO : currentPlayer = playerX;
    } else {
      currentPlayer === human ? currentPlayer = computer : currentPlayer = human;
    }
  }

  const setDifficulty = gamemode => {
    switch (gamemode) {
      case 'easy':
        difficulty = 25;
        break;
      case 'medium':
        difficulty = 50;
        break;
      case 'hard':
        difficulty = 75;
        break;
      case 'unbeatable':
        difficulty = 100;
    }
  }

  const resetGame = () => {
    if (gamemode === 'friend') {
      currentPlayer = playerX;
    } else {
      if (computerPlaysFirst) {
        computer = playerX;
        human = playerO;
        currentPlayer = computer;
        makeComputerMove();
      } else {
        human = playerX;
        computer = playerO;
        currentPlayer = human;
      }
    }
  }

  const getEmptySpaces = layout => {
    return layout.filter(index => index != 'X' && index != 'O');
  }

  const hasPlayerWon = (layout, mark) => {
    return winConditions.some(condition => condition.every(index => layout[index] === mark));
  }

  const makeComputerMove = () => {
    let emptySpaces = getEmptySpaces(gameboard.getLayout());
    if (emptySpaces.length === 9) {
      let index = Math.floor(Math.random() * 9);
      var tile = document.querySelector(`button[value="${index}"]`);
    } else {
      if (Math.ceil(Math.random() * 100) > difficulty) {
        let index = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
        var tile = document.querySelector(`button[value="${index}"]`);
      } else {
        let index = minmax(gameboard.getLayout(), getCurrentPlayerMark()).index;
        var tile = document.querySelector(`button[value="${index}"]`);
      }
    }
    displayController.placeMark(tile);
  }

  const minmax = (layout, mark) => {
    const emptySpaces = getEmptySpaces(layout);

    if (hasPlayerWon(layout, human.getMark())) {
      return { score: -10 };
    } else if (hasPlayerWon(layout, computer.getMark())) {
      return { score: 10 };
    } else if (emptySpaces.length === 0) {
      return { score: 0 };
    }

    const allMoves = [];

    for (let i = 0; i < emptySpaces.length; i++) {
      const currentMove = {};

      currentMove.index = layout[emptySpaces[i]];
      gameboard.setLayout(emptySpaces[i], mark);

      if (mark === computer.getMark()) {
        var result = minmax(gameboard.getLayout(), human.getMark());
      } else {
        var result = minmax(gameboard.getLayout(), computer.getMark());
      }
      currentMove.score = result.score;
      gameboard.setLayout(emptySpaces[i], currentMove.index);
      allMoves.push(currentMove);
    }

    let bestPlay = null;

    if (mark === computer.getMark()) {
      let bestScore = -Infinity;
      for (let i = 0; i < allMoves.length; i++) {
        if (allMoves[i].score > bestScore) {
          bestScore = allMoves[i].score;
          bestPlay = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < allMoves.length; i++) {
        if (allMoves[i].score < bestScore) {
          bestScore = allMoves[i].score;
          bestPlay = i;
        }
      }
    }
    return allMoves[bestPlay];
  }

  return {
    setGamemode,
    getGamemode,
    setComputerPlaysFirst,
    getCurrentPlayer,
    getCurrentPlayerMark,
    toggleCurrentPlayer,
    setDifficulty,
    resetGame,
    getEmptySpaces,
    hasPlayerWon,
    makeComputerMove
  }
})()