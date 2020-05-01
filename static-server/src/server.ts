/*
 * @Description: 服务器配置
 * @Author: LuckRain7
 * @Date: 2020-04-28 18:51:40
 */
import app from './app'
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
})