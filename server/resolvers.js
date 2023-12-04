import { GraphQLError } from 'graphql';
import { getCompany } from './db/companies.js';
import { getJob, getJobs, getJobsByCompany } from './db/jobs.js';

function toISODate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
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

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
  
  Job: {
    date: (job) => toISODate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  }
};