import { defaultConfig } from '../config/NodeAutochglogConfig';
import { Changelog } from '../model/Changelog';
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
    return b.date > a.date ? -1 : +1;
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

export const buildChangelogMetadata = (
  commitsByTagsAndCategories: Record<string, Record<string, Commit[]>>
): Changelog => {
  return {
    releases: Object.entries(commitsByTagsAndCategories)
      .map(([releaseName, categoriesMap]) => ({
        name: releaseName,
        categories: Object.entries(categoriesMap).map(
          ([categoryName, commits]) => ({
            name: categoryName,
            commits: commits
          })
        ),
        date:
          Object.values(categoriesMap)
            .map((commits) =>
              commits.filter((c) => c.decorations.includes(releaseName))
            )
            .flat(1)[0]?.date || new Date()
      }))
      .sort((rel1, rel2) => (rel1.date > rel2.date ? -1 : +1))
  };
};
