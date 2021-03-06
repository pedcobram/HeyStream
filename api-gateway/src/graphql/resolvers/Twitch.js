import UsersService from "#root/adapters/UsersService";

const Twitch = {
    user: async twitch => {
        return await UsersService.fetchUser({ userId: twitch.userId });
    }
}

export default Twitch;