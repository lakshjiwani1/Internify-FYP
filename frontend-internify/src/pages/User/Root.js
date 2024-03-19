import React from 'react'
import Navigationbar from '../../components/Navigationbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer';

function Root() {
  return (
    <>
        <Navigationbar/>
        <main>
            <Outlet/>
        </main>
        <Footer/>
    </>
  )
}

export default Root;