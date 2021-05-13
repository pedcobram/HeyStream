import TwitchService from "#root/adapters/TwitchService";

const getTwitchQueryResolver = async (obj, { query }, context) => {
    const body = await TwitchService.getTwitchQuery({ query });

    return JSON.parse(body.body).data;
};

export default getTwitchQueryResolver;