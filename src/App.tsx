import { useState } from 'react'
import './App.css'

function App() {
  const [monster1Health, setMonster1Health] = useState(100)
  const [monster2Health, setMonster2Health] = useState(100)

  const [monster1Position, setMonster1Position] = useState(-1)
  const [monster2Position, setMonster2Position] = useState(1)

  const positions = [-2, -1, 0, 1, 2]

  return (
    <>
      <div className="container mx-auto p-4">

        <div className="row">
          <div className="col">
            <div className="grid grid-cols-2 gap-4">

              <div>
                <h2 className="text-2xl font-semibold mb-2">Monster 1</h2>
                {/* health bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-red-500 h-4 rounded-full transition-width duration-300" style={{
                    width: `${monster1Health}%`
                  }}></div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2">Monster 2</h2>
                {/* health bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-red-500 h-4 rounded-full transition-width duration-300" style={{
                    width: `${monster2Health}%`
                  }}></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="grid grid-cols-5 gap-4">
              {positions.map((pos: number, idx: number) => (
                <div
                  key={idx}
                  className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center"
                >

                  {monster1Position === pos && (
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">M1</div>
                  )}
                  {monster2Position === pos && (
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">M2</div>
                  )}

                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-start gap-2">
                {/* monster 1 controls */}
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    let newHealth = monster2Health - 10
                    if (newHealth < 0) newHealth = 0
                    setMonster2Health(newHealth)
                  }}>
                  Attack
                </button>

                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    let newPosition = monster1Position - 1
                    if (newPosition < -2) newPosition = -2
                    setMonster1Position(newPosition)
                  }}>
                  Move Left
                </button>

                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    let newPosition = monster1Position + 1
                    if (newPosition > 2) newPosition = 2
                    setMonster1Position(newPosition)
                  }}>
                  Move Right
                </button>

              </div>

              <div className="flex justify-end gap-2">
                {/* monster 2 controls */}
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    let newHealth = monster1Health - 10
                    if (newHealth < 0) newHealth = 0
                    setMonster1Health(newHealth)
                  }}>
                  Attack
                </button>

                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    let newPosition = monster2Position - 1
                    if (newPosition < -2) newPosition = -2
                    setMonster2Position(newPosition)
                  }}>
                  Move Left
                </button>

                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    let newPosition = monster2Position + 1
                    if (newPosition > 2) newPosition = 2
                    setMonster2Position(newPosition)
                  }}>
                  Move Right
                </button>
              </div>

            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {monster1Health === 0 && <h2 className="text-2xl font-bold text-red-600 mt-4">Monster 2 Wins!</h2>}
            {monster2Health === 0 && <h2 className="text-2xl font-bold text-red-600 mt-4">Monster 1 Wins!</h2>}
            {/* reset health button */}
            {(monster1Health === 0 || monster2Health === 0) && (
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  setMonster1Health(100)
                  setMonster2Health(100)
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
