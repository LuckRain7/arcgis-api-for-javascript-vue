/*
 * @Description: '/' 路径下路由
 * @Author: LuckRain7
 * @Date: 2020-04-28 19:38:13
 */

import { Router } from 'express'
import HomeController from '../controllers/homeController'

const router = Router()

router.route('').get(HomeController.home)
router.route('/about').get(HomeController.about)

export default router
