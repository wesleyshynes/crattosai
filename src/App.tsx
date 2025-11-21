import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="row">
          <div className="col">
            <h1 className="text-3xl font-bold underline">
              hello crattosai

            </h1>

            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setCount(count + 1)}>
              count is {count}
            </button>

          </div>
        </div>
      </div>
    </>
  )
}

export default App
