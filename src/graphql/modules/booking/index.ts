import { merge } from 'lodash';
import { schema } from './booking.schema';
import { resolvers as urlResolvers } from './booking.resolvers';

const resolvers = merge(urlResolvers);

export { schema, resolvers };
