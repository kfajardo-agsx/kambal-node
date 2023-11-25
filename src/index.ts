import { createServer } from './wire'
import dotenv from 'dotenv';
import { log } from './config'

const main = async () => {

    if (process.env.NODE_ENV !== 'production') {
        dotenv.config()
    }

    const server = await createServer();
    server.start()

    log.info("===========================");
    log.info("      SERVER STARTED       ");
    log.info("===========================");
}

main()
