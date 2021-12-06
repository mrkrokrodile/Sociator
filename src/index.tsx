import http from 'http';
import dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import root from "./routes/index";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import { checkUser, requireAuth } from './middleware/AuthMiddleware';
import multer from 'multer';
import React from "react";
import ReactDOM from "react-dom";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Mainblock from "../src/components/main-block.js";


export const App = () => {
    return (
        <div>
            <div id="homepage">

              <Mainblock />
              
            </div>
           
            
             
        </div>
       
        
    )
}


class Server {
    private readonly _app: express.Application
    private _server: http.Server

    constructor() {
        // Chargement de fichier 
        dotenv.config()
        this._app = express()
        this._app.set('PORT', process.env.PORT || 3000)
        // Lecture {request} Ecriture {Response}
        // Permet la lecture / ecriture de cookie
        this.app.use(cookieParser())
        this._app.use(express.json())

        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}))

      
        this.app.get('*', checkUser);
        this.app.get('/jwtid', requireAuth, (req: Request, res: Response) => {
            res.status(200).send(res.locals.user._id)
        });


        // routes
        this.app.use('/', root);
    }
    

    get app(): express.Application { return this._app }
    get server(): http.Server { return this._server }

    public async start() {
        this._server = this.app.listen(this._app.get('PORT'))
        const OPTIONS = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            SocketTimeoutMS: 30000,
            keepAlive: true,
            autoIndex: true,
            retryWrites: false
        }
        const cnx = await mongoose.connect(process.env.ATLAS, OPTIONS)
        console.log(`Connected to ${cnx.connection.host}`)
    }
}
if(typeof window !== 'undefined') {
    ReactDOM.render(<App />, document.getElementById('root'));
 }

new Server().start().then(() => console.log(`Server running on http://localhost:${process.env.PORT}`))

