import { Commit } from '../model/Commit';

export const organizeCommitsByCategory = (
  commits: Commit[]
): Record<string, Commit[]> => {
  return commits.reduce(
    (acc, commit) => {
      (acc[commit.category] ||= []).push(commit);
      return acc;
    },
    {} as Record<string, Commit[]>
  );
};
