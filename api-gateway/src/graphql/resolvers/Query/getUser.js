import UsersService from "#root/adapters/UsersService";

const getUserResolver = async (obj, { id }, context) => {
    return await UsersService.fetchUser({ userId: id });
};

export default getUserResolver;