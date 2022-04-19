import React from 'react';
import {Helmet} from "react-helmet";
           
const NotFound = () => {
    return (
        <>
            <Helmet>
               <title>404 - Not Found</title>
               <meta name="description" content="Oops ! Page Not Found"/>
           </Helmet>
            <div className="notFound">
                <div className="notFound_container">
                    <h1 className="notFound_container_h1">404</h1>
                    <p className="notFound_container_p">Oops ! Page Not Found</p>
                </div>        
            </div>
        </>
    )
}

export default NotFound;