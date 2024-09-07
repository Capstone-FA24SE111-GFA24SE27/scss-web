import { useState } from 'react'
import { Button } from '@mui/material'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='border border-black pl-8'>
        <Button>Click me</Button>
      </div>
    </>
  )
}

export default App
