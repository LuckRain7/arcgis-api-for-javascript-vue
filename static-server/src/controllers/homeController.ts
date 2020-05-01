/*
 * @Description:  
 * @Author: LuckRain7
 * @Date: 2020-04-28 19:39:37
 */
import { Request, Response } from "express";
class HomeController {
    static home = async (req: Request, res: Response) => {
        res.send('这里是静态服务器')
    }
    static about = async (req: Request, res: Response) => {
        res.send('使用TS进行编写')
    }
}
export default HomeController