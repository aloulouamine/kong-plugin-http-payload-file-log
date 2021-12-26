const HttpPayloadFileLogPlugin = require('../index').Plugin;
jest.mock('fs');
describe('HttpPayloadFileLog', () => {
    const config = {};
    let plugin;
    beforeEach(() => {
        plugin = new HttpPayloadFileLogPlugin(config);
    });
    it('should instantiate with different id', () => {
        const anotherPlugin = new HttpPayloadFileLogPlugin(config);
        expect(anotherPlugin.id).not.toBe(plugin.id);
    });
})
