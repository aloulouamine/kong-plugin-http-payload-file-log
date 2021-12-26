'use strict';

const { randomUUID } = require('crypto');
const { createWriteStream } = require('fs');

class HttpPayloadFileLog {

    constructor(config) {
        this.config = config
        this.writer = createWriteStream(`/home/kong/logs-${this.id}.log`);
        this.id = randomUUID();
    }

}

module.exports = {
    Plugin: HttpPayloadFileLog,
    Schema: [
        { logDirectory: { type: "string" } },
    ],
    name: 'http-payload-file-log',
    Version: '0.1.0',
    Priority: 0,
}
