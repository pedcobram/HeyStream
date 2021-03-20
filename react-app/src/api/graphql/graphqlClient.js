import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

export const cache = new InMemoryCache();

const client = new ApolloClient({
    cache: new InMemoryCache({
        dataIdFromObject: o => (o._id ? `${o.__typename}:${o._id}`: null),
      }),
    link: new HttpLink({
        credentials: "include",
        uri: process.env.SERVICES_URI + '/graphql'
    })
})

export default client;