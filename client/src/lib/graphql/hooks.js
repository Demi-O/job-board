import { useMutation, useQuery } from "@apollo/client";

import { companyByIdQuery, createJobMutation, getJobsQuery, jobByIdQuery } from "./queries";

export function useCompany(id) {
  const { data, error, loading } = useQuery(companyByIdQuery, {
    variables: { id },
  });

  return { company: data?.company, loading, error: Boolean(error) };
}

export function useJob(id) {
  const { data, error, loading } = useQuery(jobByIdQuery, {
    variables: { id },
  });

  return { job: data?.job, loading, error: Boolean(error) };
}

export function useJobs() {
  const { data, error, loading } = useQuery(getJobsQuery, {
    fetchPolicy: 'network-only',
  });

  return { jobs: data?.jobs, loading, error: Boolean(error) };
}

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation);
  const createJob = async (title, description) => {
    const { data: { job } } = await mutate({
      variables: { input: { title, description } },
      update: (cache, result) => {
        const { data } = result;
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });

    return job;
  };

  return { createJob, loading };
}