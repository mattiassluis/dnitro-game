const getters = {
  currentGame: state => state.games[state.remoteId],
  currentPlayer: state => (player) => state.games[state.remoteId].players.filter(p => p.identifier === player)[0],
  gameId: state => state.remoteId,
  gameList: state => state.gameList,
  logs: state => state.gameLogs,
  compact: state => state.compact
}
export default getters
