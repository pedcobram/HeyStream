import * as Query from "./Query";
import * as Mutation from "./Mutation";
import UserSession from "./UserSession";
import Twitch from "./Twitch";
import Youtube from "./Youtube";

const resolvers = { Mutation, Query, UserSession, Twitch, Youtube };

export default resolvers;