import { Filter, FilterType } from './types';

export const processFile = (allText: string, filters: Filter[]) => {
  const splitText = allText.split('\r\n\r\n').map(t => {
    const [index, timecode, ...splitText] = t.split('\r\n');
    const text = splitText.join('\r\n');
    return { index, timecode, text };
  });

  const filtersEdit = filters.filter(f => f.type === FilterType.RemoveText);
  const allFiltersEdit = filtersEdit.flatMap(f => f.text.split(','));
  const filtersRemove = filters.filter(f => f.type === FilterType.DeleteTitle);

  const allTextProcessed = splitText
    .filter(t => // deleting titles
      filtersRemove.filter(f => f.text === t.text).length === 0)
    .map((t, i) => ({ ...t, index: i + 1 })) // reindexing
    .map(t => { // editing titles
      let newText = t.text;
      for (let i = 0; i < allFiltersEdit.length; i++) {
        newText = newText.replaceAll(allFiltersEdit[i], '');
      }
      return { ...t, text: newText };
    })
    .map(t => t.index + '\r\n' + t.timecode + '\r\n' + t.text)
    .join('\r\n\r\n'); // putting back together

  return allTextProcessed;
};

export const restoreFromVer2 = (allText: string) => {
  const reg = new RegExp(/^.*-->.*$/gm);

  let i = 0;
  const processed = allText.replaceAll(reg, timecode =>
    '\r\n' + i++ + '\r\n' + timecode
  );

  return processed;
};