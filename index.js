'use strict';

const { randomUUID } = require('crypto');
const { appendFile } = require('fs/promises');
const path = require('path');
const { EOL } = require('os');

class HttpPayloadFileLog {

    /**
     * Plugin constructor
     * 
     * @param {*} config plugin config, detailed in schema
     */
    constructor(config) {
        this.config = config;
        /**
         * Multiple plugin instances can be creates with kong we
         * need to identify every plugin with a unique id and create 
         * a separate log file foreach instance to avoir managing
         * concurrent process file writings.
         */
        this.id = randomUUID();
        this.log_file = path.join(config.log_directory, `logs-${this.id}.log`);
    }

    /**
     * Log request and response payload
     * 
     * @param {*} kong kong plugin instance
     */
    async response(kong) {
        const date = await kong.nginx.reqStartTime()
        // request
        const method = await kong.request.getMethod();
        const requestHeaders = JSON.stringify(await kong.request.getHeaders());
        const payload = await kong.request.getRawBody();
        // construct url
        const pathWithQuery = await kong.request.getPathWithQuery()
        const host = await kong.request.getHost();
        const scheme = await kong.request.getScheme();
        const url = `${scheme}://${host}${pathWithQuery}`
        // response
        const body = await kong.service.response.getRawBody();
        const responseHeaders = JSON.stringify(
            await kong.service.response.getHeaders()
        );
        const status = await kong.service.response.getStatus();
        // write log
        try {
            await appendFile(
                this.log_file,
                JSON.stringify({
                    date,
                    request: {
                        headers: requestHeaders,
                        method,
                        url,
                        payload
                    },
                    response: {
                        headers: responseHeaders,
                        status,
                        body
                    }
                }) + EOL);
        } catch (error) {
            await this.handleException(
                kong,
                error,
                `Error writing log file`
            );
        }
    }


    /**
     * Log an exception
     * 
     * @param {*} kong kong instance
     * @param {Error} error exception error
     * @param {string} description description
     */
    async handleException(kong, error, description) {
        await kong.log.err(description);
        if (error) {
            if (error.code && error.message) {
                await kong.log.err(`${error.code}: ${error.message}`);
            } else if (error.code) {
                await kong.log.err(`code :${error.code}`);
            } else if (error.message) {
                await kong.log.err(`message :${error.message}`);
            } else {
                await kong.log.err(error)
            }
        }
    }
}

module.exports = {
    Plugin: HttpPayloadFileLog,
    Schema: [
        {
            log_directory: {
                type: "string",
                default: '/home/kong/',
                required: true
            }
        },
    ],
    name: 'http-payload-file-log',
    Version: '0.1.0',
    Priority: 0,
}
