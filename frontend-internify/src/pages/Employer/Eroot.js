import React from 'react'
import Navigationbar from '../../components/Navigationbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer';
import EmployerNavigationbar from '../../components/Enavigationbar';

function Eroot() {
  return (
    <>
        <EmployerNavigationbar/>
        <main>
            <Outlet/>
        </main>
        <Footer/>
    </>
  )
}

export default Eroot;