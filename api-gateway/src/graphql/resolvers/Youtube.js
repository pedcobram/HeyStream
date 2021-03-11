import UsersService from "#root/adapters/UsersService";

const Youtube = {
    userId: async youtube => {
        return await UsersService.fetchUser({ userId: youtube.userId });
    }
}

export default Youtube;