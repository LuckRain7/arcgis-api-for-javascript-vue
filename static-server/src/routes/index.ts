/*
 * @Description:  
 * @Author: LuckRain7
 * @Date: 2020-04-28 18:58:06
 */

import { Router } from "express";
import home from './home'
import user from './user'

const homeRoutes = Router();
const userRoutes = Router();

userRoutes.use('/user',user)
homeRoutes.use('/', home)

export default {
    homeRoutes,
    userRoutes
}