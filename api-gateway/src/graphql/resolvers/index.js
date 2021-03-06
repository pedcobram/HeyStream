import * as Query from "./Query";
import * as Mutation from "./Mutation";
import UserSession from "./UserSession";
import Twitch from "./Twitch";

const resolvers = { Mutation, Query, UserSession, Twitch};

export default resolvers;