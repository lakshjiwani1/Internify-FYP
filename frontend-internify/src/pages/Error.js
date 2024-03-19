import React from 'react'
import Navigationbar from '../components/Navigationbar'

function Error() {
    return (
        <>
            <Navigationbar />
            <main>
                <h1>An Error occurred!</h1>
                <p>Could not find this page.</p>
            </main>
        </>
    )
}

export default Error