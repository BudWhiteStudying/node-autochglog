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
  const commitByTagsMap: Record<string, Commit[]> = {};
  commits.sort((a, b) => {
    return new Date(b.date) > new Date(a.date) ? -1 : +1;
  });

  let buffer: Commit[] = [];
  for (const commit of commits) {
    buffer.push(commit);
    const relevantTags = commit.decorations.filter((d) =>
      new RegExp(defaultConfig.tagFilter).test(d)
    );
    if (relevantTags.length > 0) {
      for (const tag of relevantTags) {
        (commitByTagsMap[tag] ||= []).push(...buffer);
      }
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    commitByTagsMap[defaultConfig.initialTag] = buffer;
  }

  return commitByTagsMap;
};

export const organizeCommitsByTagsAndCategories = (
  commits: Commit[]
): Record<string, Record<string, Commit[]>> => {
  const commitsByTagsAndCategories: Record<
    string,
    Record<string, Commit[]>
  > = {};
  const commitsByTags = organizeCommitsByTags(commits);
  for (const tag in commitsByTags) {
    commitsByTagsAndCategories[tag] = organizeCommitsByCategory(
      commitsByTags[tag]
    );
  }

  return commitsByTagsAndCategories;
};
