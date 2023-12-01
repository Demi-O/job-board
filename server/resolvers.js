import { getCompany } from './db/companies.js';
import { getJob, getJobs } from './db/jobs.js';

function toISODate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}

export const resolvers = {
  Query: {
    job: (_root, { id }) => getJob(id),
    jobs: () => getJobs(),
  },
  
  Job: {
    date: (job) => toISODate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  }
};