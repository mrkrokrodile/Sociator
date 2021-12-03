import { Router } from "express";
import UserRoutes from "./UserRoutes";
import AuthRoutes from "./AuthRoutes";
import PostRoutes from "./PostRoutes";
import UploadRoutes from "./UploadRoutes";


const root = Router()



root.use('/auth', AuthRoutes)
root.use('/users', UserRoutes)
root.use('/post', PostRoutes)
root.use('/upload', UploadRoutes)


export default root