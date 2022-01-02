const HttpPayloadFileLogPlugin = require('../index').Plugin;

// mock fs module.
jest.mock('fs/promises', () => {
    return {
        __esModule: true,
        appendFile: jest.fn(path => ({ path }))
    }
});

const kong = {
    log: {
        err: jest.fn()
    }
}

describe('HttpPayloadFileLog', () => {
    const config = {
        log_directory: 'home/kong'
    };
    let plugin;

    beforeEach(() => {
        plugin = new HttpPayloadFileLogPlugin(config);
    });
    it('should instantiate with different id', () => {
        const anotherPlugin = new HttpPayloadFileLogPlugin(config);
        expect(anotherPlugin.id).not.toBe(plugin.id);
    });

    it('should write log file in defined path', () => {
        expect(plugin.log_file).toBe(
            `home/kong/logs-${plugin.id}.log`
        );
    });

    it('should handle exception', async () => {
        const errorDescription = 'Error description';
        const errorMessage = 'Error message';
        await plugin.handleException(
            kong,
            new Error(errorMessage),
            errorDescription
        );
        expect(kong.log.err.mock.calls.length).toBe(2);
        expect(kong.log.err.mock.calls[0][0]).toBe(errorDescription);
        expect(kong.log.err.mock.calls[1][0]).toBe(`message :${errorMessage}`);
    })
})
