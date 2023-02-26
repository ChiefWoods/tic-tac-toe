const gameboard = (() => {
  var layout = [0, 1, 2, 3, 4, 5, 6, 7, 8];

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
  const tiles = document.querySelectorAll('.tile');
  const reset = document.querySelector('.reset');

  select.addEventListener('change', e => {
    changeGamemode(e.target.value);
    resetGame();
  });

  tiles.forEach(tile => tile.addEventListener('click', e => placeMark(e)))

  reset.addEventListener('click', () => resetGame());

  const changeGamemode = gamemode => {
    gameController.setGamemode(gamemode);
    if (gamemode === 'friend') {
      plays.forEach(play => play.setAttribute('disabled', ''));
    } else {
      playO.removeAttribute('disabled');
    }
  }

  const resetGame = () => {
    tiles.forEach(tile => {
      tile.textContent = '';
      tile.removeAttribute('disabled');
    });
    gameController.resetGame();
    gameboard.resetLayout();
    updateTurn();
  }

  const placeMark = e => {
    e.target.setAttribute('disabled', '');
    e.target.textContent = gameController.getCurrentPlayerMark();
    let index = parseInt(e.target.value);
    gameboard.setLayout(index, gameController.getCurrentPlayerMark());
    if (gameController.hasPlayerWon(index)) {
      declareWinner();
      disableBoard();
      return;
    } else if (gameController.getEmptySpaces(gameboard.getLayout()).length === 0) {
      declareDraw();
      disableBoard();
      return;
    }
    gameController.incrementRound();
    updateTurn();
  }

  const updateTurn = () => {
    turn.textContent = `It's ${gameController.getCurrentPlayerMark()}'s turn!`;
  }

  const declareWinner = () => {
    turn.textContent = `${gameController.getCurrentPlayerMark()} wins!`;
  }

  const declareDraw = () => {
    turn.textContent = `Draw! No one wins this round.`;
  }

  const disableBoard = () => {
    tiles.forEach(tile => tile.setAttribute('disabled', ''));
  }
})()

const gameController = (() => {
  let round = 1;
  let gamemode = 'easy';
  let playerX = Player('X');
  let playerO = Player('O');

  const incrementRound = () => {
    round++;
  }

  const setGamemode = gm => {
    gamemode = gm;
  }

  const resetGame = () => {
    round = 1;
  }

  const getCurrentPlayerMark = () => {
    return round % 2 ? playerX.getMark() : playerO.getMark();
  }

  const getEmptySpaces = layout => {
    return layout.filter(space => space != 'X' && space != 'O');
  }

  const hasPlayerWon = (index) => {
    let winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions.filter(condition => condition
      .includes(index))
      .some(condition => condition
        .every(position => gameboard.getMark(position) === gameController.getCurrentPlayerMark())
      )
  }

  return {
    incrementRound,
    setGamemode,
    resetGame,
    getEmptySpaces,
    hasPlayerWon,
    getCurrentPlayerMark
  }
})()