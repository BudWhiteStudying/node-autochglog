import { defaultConfig } from '../config/NodeAutochglogConfig';
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

export const organizeCommitsByTags = (
  commits: Commit[]
): Record<string, Commit[]> => {
  const allDecorations = commits
    .reduce((acc, commit) => {
      for (let d of commit.decorations) {
        if (!acc.includes(d)) {
          acc.push(d);
        }
      }
      return acc;
    }, [] as string[])
    .filter((decoration) =>
      new RegExp(defaultConfig.tagFilter).test(decoration)
    );

  return allDecorations.length > 0
    ? allDecorations.reduce(
        (acc, decoration) => {
          (acc[decoration] ||= []).push(
            ...commits.filter((commit) =>
              commit.decorations.includes(decoration)
            )
          );
          return acc;
        },
        {} as Record<string, Commit[]>
      )
    : {
        [defaultConfig.initialTag]: commits
      };
};
