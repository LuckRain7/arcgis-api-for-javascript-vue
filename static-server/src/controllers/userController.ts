/*
 * @Description:  
 * @Author: LuckRain7
 * @Date: 2020-04-28 18:58:53
 */
import { Request, Response } from "express";
class UserController {
    static listAll = async (req: Request, res: Response) => {
        console.log('list ALl');
    }
    static getOneById = async (req: Request, res: Response) => {
        console.log('get one by id');
    }
    static newUser = async (req: Request, res: Response) => {
        console.log('create user');
    }
    static editUser = async (req: Request, res: Response) => {
        console.log('edit user');
    }
    static delUser = async (req: Request, res: Response) => {
        console.log('del user');
    }
}
export default UserController