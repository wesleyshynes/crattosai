import { useEffect, useState } from 'react'
import './App.css'

const generateBlankMonsterState = () => ({
  health: 100,
  position: 0,
  selectedActions: [] as string[],
  currentAction: '' as string
})

const generateNewGameState = () => ({
  status: 'selectActions' as 'selectActions' | 'resolveActions' | 'resolvingActions',
  monster1: {
    ...generateBlankMonsterState(),
    position: -1
  },
  monster2: {
    ...generateBlankMonsterState(),
    position: 1
  }
})

function App() {

  const [gameState, setGameState] = useState(generateNewGameState())

  const positions = [-2, -1, 0, 1, 2]

  useEffect(() => {
    console.log('USE EFFECT: Game State Updated:', gameState)
    // if in resolveActions state, resolve actions
    if (gameState.status === 'resolveActions') {
      const actionTimeout = setTimeout(() => {
        resolveAction()
      }, 1000) // 1 second delay between action resolutions
      return () => clearTimeout(actionTimeout)
    }

    return () => { }
  }, [gameState])

  const dealMonsterDamage = (monster: 'monster1' | 'monster2', damage: number, prevState: any) => {
    const newHealth = Math.max(prevState[monster].health - damage, 0)
    return {
      ...prevState,
      [monster]: {
        ...prevState[monster],
        health: newHealth
      }
    }

  }

  const moveMonster = (monster: 'monster1' | 'monster2', direction: 'left' | 'right', prevState: any) => {
    const currentPosition = prevState[monster].position
    let newPosition = currentPosition
    if (direction === 'left') {
      newPosition = Math.max(currentPosition - 1, -2)
    } else {
      newPosition = Math.min(currentPosition + 1, 2)
    }
    return {
      ...prevState,
      [monster]: {
        ...prevState[monster],
        position: newPosition
      }
    }
  }

  const resolveAction = async () => {
    // are there actions to resolve?
    if (gameState.status !== 'resolveActions') return

    // make sure each monster has an action to resolve
    const monster1Action = gameState.monster1.selectedActions.shift()
    const monster2Action = gameState.monster2.selectedActions.shift()

    if (!monster1Action && !monster2Action) {
      // no actions to resolve, back to selecting actions
      setGameState(prevState => ({
        ...prevState,
        status: 'selectActions',
        monster1: {
          ...prevState.monster1,
          currentAction: '' as string
        },
        monster2: {
          ...prevState.monster2,
          currentAction: '' as string
        }
      }))
      return
    }

    let newGameState = { ...gameState }
    newGameState.status = 'resolvingActions'

    newGameState.monster1.currentAction = ''
    newGameState.monster2.currentAction = ''

    // resolve movements first
    if (monster1Action === 'moveLeft' || monster1Action === 'moveRight') {
      newGameState = moveMonster('monster1', monster1Action === 'moveLeft' ? 'left' : 'right', newGameState)
      newGameState.monster1.currentAction = monster1Action
    }
    if (monster2Action === 'moveLeft' || monster2Action === 'moveRight') {
      newGameState = moveMonster('monster2', monster2Action === 'moveLeft' ? 'left' : 'right', newGameState)
      newGameState.monster2.currentAction = monster2Action
    }

    // set state to resolving actions to show movement first
    if (monster1Action === 'moveLeft' || monster1Action === 'moveRight' || monster2Action === 'moveLeft' || monster2Action === 'moveRight') {
      setGameState({ ...newGameState })
      // wait a moment to show movement before resolving attacks
      await new Promise(resolve => setTimeout(resolve, 1000))

    }

    newGameState.monster1.currentAction = ''
    newGameState.monster2.currentAction = ''

    // resolve attacks
    if (monster1Action === 'attack') {
      // check if in range
      if (Math.abs(newGameState.monster1.position - newGameState.monster2.position) <= 1) {
        newGameState = dealMonsterDamage('monster2', 20, newGameState)
      }
      newGameState.monster1.currentAction = 'attack'
    }
    if (monster2Action === 'attack') {
      // check if in range
      if (Math.abs(newGameState.monster2.position - newGameState.monster1.position) <= 1) {
        newGameState = dealMonsterDamage('monster1', 20, newGameState)
      }
      newGameState.monster2.currentAction = 'attack'
    }

    if (monster1Action === 'attack' || monster2Action === 'attack') {
      setGameState({ ...newGameState })
      await new Promise(resolve => setTimeout(resolve, 1000))
    }


    newGameState.monster1.currentAction = ''
    newGameState.monster2.currentAction = ''

    newGameState.status = 'resolveActions'

    // update state
    setGameState({ ...newGameState })
  }

  const resetGame = () => {
    setGameState(generateNewGameState())
  }

  const queueAction = (monster: 'monster1' | 'monster2', action: string) => {
    setGameState(prevState => {
      const selectedActions = prevState[monster].selectedActions
      if (selectedActions.length >= 2) return prevState
      let actionCount = prevState.monster1.selectedActions.length + prevState.monster2.selectedActions.length
      return {
        ...prevState,
        [monster]: {
          ...prevState[monster],
          selectedActions: [...selectedActions, action]
        },
        status: actionCount + 1 >= 4 ? 'resolveActions' : prevState.status,
      }
    })
  }

  const unQueueAction = (monster: 'monster1' | 'monster2', selectedActionIndex: number = -1) => {
    const actionIndex = selectedActionIndex !== -1 ? selectedActionIndex : gameState[monster].selectedActions.length - 1
    setGameState(prevState => {
      const selectedActions = prevState[monster].selectedActions
      return {
        ...prevState,
        [monster]: {
          ...prevState[monster],
          selectedActions: selectedActions.filter((_, idx) => idx !== actionIndex)
        }
      }
    })
  }

  return (
    <>
      <div className="container mx-auto p-4">

        {/* Monsters Status */}
        <div className="row">
          <div className="col">
            <div className="grid grid-cols-2 gap-4">

              {(['monster1', 'monster2'] as ['monster1', 'monster2']).map((monster: 'monster1' | 'monster2', idx: number) => {
                // display the Name, healthbar and actions queue
                return (
                  <div key={monster}>
                    <h2 className="text-2xl font-semibold mb-2">Monster {idx + 1} {gameState[monster].currentAction}</h2>
                    {/* health bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                      <div className="bg-red-500 h-4 rounded-full transition-width duration-300" style={{
                        width: `${gameState[monster].health}%`
                      }}></div>
                    </div>

                    {/* 2 boxes for selected actions */}
                    <div className={`flex space-x-2 mb-4${idx === 1 ? ' ml-auto justify-end' : ''}`}>
                      {['', ''].map((action, index) => {
                        const actionSelected = gameState[monster].selectedActions[index] ? gameState[monster].selectedActions[index] : 'none'
                        return (
                          <div
                            key={`${index}-${actionSelected}`}
                            className={`w-16 h-8 ${gameState[monster].selectedActions[index] ? 'bg-blue-500' : 'bg-gray-300'} rounded flex items-center justify-center`} />
                        )
                      })}
                    </div>
                  </div>

                )
              })}

            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="row">
          <div className="col">
            <div className="grid grid-cols-5 gap-4">
              {positions.map((pos: number, idx: number) => (
                <div
                  key={idx}
                  className="w-full h-16 border-2 border-gray-300 flex items-center justify-center"
                >

                  {gameState.monster1.position === pos && (
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">M1</div>
                  )}
                  {gameState.monster2.position === pos && (
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">M2</div>
                  )}

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monster Buttons */}
        <div className="row">
          <div className="col">
            <div className="grid grid-cols-2 gap-4">

              {(['monster1', 'monster2'] as ['monster1', 'monster2']).map((monster: 'monster1' | 'monster2', idx: number) => {
                const disableButton = gameState.status !== 'selectActions' || gameState[monster].selectedActions.length >= 2
                const disableUndo = gameState.status !== 'selectActions' || gameState[monster].selectedActions.length === 0
                return (

                  <div
                    key={`control-${idx}`}
                    className={`flex gap-2 ${idx === 1 ? 'justify-end' : 'justify-start'} flex-wrap`}
                  >
                    {/* monster controls */}
                    <button
                      className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${disableButton ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={disableButton}
                      onClick={() => {
                        queueAction(monster, 'attack')
                      }}>
                      Attack
                    </button>

                    <button
                      className={`mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${disableButton ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={disableButton}
                      onClick={() => {
                        queueAction(monster, 'moveLeft')
                      }}>
                      Move Left
                    </button>

                    <button
                      className={`mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${disableButton ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={disableButton}
                      onClick={() => {
                        queueAction(monster, 'moveRight')
                      }}>
                      Move Right
                    </button>

                    {/* undo button */}
                    <button
                      className={`mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${disableUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={disableUndo}
                      onClick={() => {
                        unQueueAction(monster)
                      }}>
                      Undo
                    </button>

                  </div>
                )
              })}

            </div>
          </div>
        </div>

        {/* Reset Buttons */}
        <div className="row">
          <div className="col">
            {gameState.monster1.health === 0 && <h2 className="text-2xl font-bold text-red-600 mt-4">Monster 2 Wins!</h2>}
            {gameState.monster2.health === 0 && <h2 className="text-2xl font-bold text-red-600 mt-4">Monster 1 Wins!</h2>}
            {/* reset health button */}
            {(gameState.monster1.health === 0 || gameState.monster2.health === 0) && (
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  resetGame()
                }}>
                Reset Health
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
