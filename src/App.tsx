import { useState } from 'react'
import logo from './logo.svg'
import styled from 'styled-components';

import './App.css'

const P = styled.p`
font-size: 1.5em;
text-align: center;
color: palevioletred;
`

const Header = styled.header`
background-color: #282c34;
min-height: 100vh;
color: white;
`

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Header className="flex-col align-center justify-center">
        <img src={logo} className="App-logo" alt="logo" />
        <P className="underline">Hello Vite + React!</P>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </Header>
    </div>
  )
}

export default App
