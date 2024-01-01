type ADFNode = {
  type: string;
  content?: ADFNode[];
  text?: string;
  marks?: { type: string }[];
};

export default function jiraDescriptionToMarkdown(node: ADFNode): string {
  switch (node.type) {
    case 'doc':
      return (node.content || []).map(jiraDescriptionToMarkdown).join('\n');
    case 'paragraph':
      return (node.content || []).map(jiraDescriptionToMarkdown).join('');
    case 'text':
      if (node.marks?.some((mark) => mark.type === 'strong')) {
        return `**${node.text}**`;
      }
      return node.text || '';
    case 'bulletList':
      return (node.content || []).map(jiraDescriptionToMarkdown).join('\n');
    case 'listItem':
      return `- ${(node.content || [])
        .map(jiraDescriptionToMarkdown)
        .join('')}`;
    default:
      return '';
  }
}
