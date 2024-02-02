import { GraphQLError } from 'graphql';
import { getCompany } from './db/companies.js';
import { createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from './db/jobs.js';

function toISODate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
}

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED' },
  });
}

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) return notFoundError(`No company found with id ${id}`);
      return company;
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) return notFoundError(`No job found with id ${id}`);
      return job;
    },
    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: (_root, { input : { title, description } }, { user }) => {
      if (!user) {
        return unauthorizedError('Missing authentication');
      }

      const companyId = user.companyId;
      return createJob({ companyId, title, description });
    },

    deleteJob: (_root, { id }) => deleteJob(id),

    updateJob: (_root, { input: { id, title, description }}) => updateJob({ id, title, description})
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
  
  Job: {
    date: (job) => toISODate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  }
};