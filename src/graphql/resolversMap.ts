import { IResolvers } from '@graphql-tools/utils';
import { merge } from 'lodash';

import { resolvers as bookingResolvers } from './modules/booking';

const resolverMap: IResolvers = merge(bookingResolvers);
export default resolverMap;
