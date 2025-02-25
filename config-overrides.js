const { overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
    return {
        ...config,
        allowedHosts: ['localhost'],
    };
};

module.exports = {
    devServer: overrideDevServer(devServerConfig())
};
