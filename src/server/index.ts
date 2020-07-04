import app from 'app';
import { connect as connectToDb } from 'db';
import { connect as connectToRabbitMq } from 'lib/rabbitmq';
import env from 'config/env';
import log from 'lib/log';

async function makeServer() {
    try {
        /* 
            this is so that we can guarantee we are connected to the db
            before the server exposes itself on a port
        */
        log.initStatus(['rabbitmq', 'mongodb']);
        await connectToDb();
        await connectToRabbitMq();
        app.listen(Number(env.PORT), env.ORIGIN);
        // eslint-disable-next-line no-console
        console.log(`Running on http://${env.ORIGIN}:${env.PORT}`);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        // eslint-disable-next-line no-console
        console.log('Exiting...');
    }
}

// eslint-disable-next-line no-void
void makeServer();
