import React from 'react'
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'
import GNavbar from './components/Navbar/GNavbar.jsx'
import ADataDesa from './components/Table/ADataDesa.jsx'
import Footer from './components/Other/Footer.jsx'


function App() {
  return (
    <BrowserRouter>
    <div>
      <GNavbar/>
      <div>
        <ADataDesa/>
      </div>
    </div>
    <Footer/>

    </BrowserRouter>
  )
}

export default App