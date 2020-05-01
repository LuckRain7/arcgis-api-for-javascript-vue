/*
 * @Description: 主应用模块
 * @Author: LuckRain7
 * @Date: 2020-04-28 18:51:59
 */
import express from 'express' // express
import { json, urlencoded } from 'body-parser' // 解析模块
import cors from 'cors' // 跨域模块
import morgan from 'morgan' // 日志模块
import path from 'path' // node path
import Router from './routes/index'



class App {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.config()
        this.router()
    }
    private config() {
        // 开启 cors
        this.app.use(cors())

        // 支持  application/json类型 发送数据
        this.app.use(json());

        // 支持 application/x-www-form-urlencoded 发送数据
        this.app.use(urlencoded({ extended: false }))

        // 日志中间件
        this.app.use(morgan('dev'))

        // 设置静态文件
        this.app.use(express.static(path.resolve(__dirname, '../public')))
    }

    private router() {
        // 注入主页路由
        this.app.use(Router.homeRoutes)

        // 注入用户路由
        this.app.use(Router.userRoutes)
    }

}
export default new App().app
