const fs = require('fs');

// Read the content file
const contentText = fs.readFileSync('/home/ubuntu/upload/PixelContent.txt', 'utf-8');

// Define the structure
const sections = [
  {
    id: 'ux',
    nameAr: 'مسار تجربة المستخدم (UX)',
    nameEn: 'UX Track',
    descriptionAr: 'تعلم أساسيات تجربة المستخدم والبحث والتحليل',
    descriptionEn: 'Learn the fundamentals of user experience, research, and analysis',
    color: '#3B82F6',
    emoji: '👥',
    topics: []
  },
  {
    id: 'ui',
    nameAr: 'مسار واجهة المستخدم (UI)',
    nameEn: 'UI Track',
    descriptionAr: 'تعلم أساسيات التصميم البصري والواجهات',
    descriptionEn: 'Learn the fundamentals of visual design and interfaces',
    color: '#8B5CF6',
    emoji: '🎨',
    topics: []
  },
  {
    id: 'ux-ui',
    nameAr: 'تكامل UX × UI',
    nameEn: 'UX × UI Integration',
    descriptionAr: 'تعلم كيفية دمج UX و UI معاً',
    descriptionEn: 'Learn how to integrate UX and UI together',
    color: '#EC4899',
    emoji: '🔗',
    topics: []
  },
  {
    id: 'bonus',
    nameAr: 'محتوى إضافي',
    nameEn: 'Bonus Content',
    descriptionAr: 'نصائح وأفكار إضافية مهمة',
    descriptionEn: 'Additional important tips and ideas',
    color: '#F59E0B',
    emoji: '⭐',
    topics: []
  }
];

// Parse topics from text
function parseTopics(sectionText) {
  const topics = [];
  
  // Split by topic number pattern (1. Title, 2. Title, etc.)
  const lines = sectionText.split('\n');
  let currentTopic = null;
  let currentContent = '';
  let inQuotes = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is a topic header (e.g., "1. Title")
    const topicMatch = line.match(/^\d+\.\s+(.+)$/);
    if (topicMatch && inQuotes === false) {
      // Save previous topic
      if (currentTopic && currentContent) {
        currentTopic.content = parseContent(currentContent);
        topics.push(currentTopic);
      }
      
      // Start new topic
      const title = topicMatch[1];
      currentTopic = {
        id: title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
          .substring(0, 50),
        titleAr: title,
        titleEn: title,
        content: {}
      };
      currentContent = '';
    } else if (line.startsWith('"')) {
      inQuotes = true;
      currentContent += line.substring(1) + '\n';
    } else if (line.startsWith('"') === false && inQuotes && line.endsWith('"')) {
      currentContent += line.substring(0, line.length - 1);
      inQuotes = false;
    } else if (inQuotes) {
      currentContent += line + '\n';
    }
  }
  
  // Save last topic
  if (currentTopic && currentContent) {
    currentTopic.content = parseContent(currentContent);
    topics.push(currentTopic);
  }
  
  return topics;
}

function parseContent(contentBlock) {
  const content = {
    introduction: '',
    concept: '',
    whyItMatters: '',
    breakdown: '',
    example: '',
    badVsGood: '',
    commonMistakes: '',
    practicalTips: '',
    miniActivity: '',
    summary: ''
  };
  
  const lines = contentBlock.split('\n');
  let currentField = null;
  let currentValue = '';
  
  for (const line of lines) {
    if (line.startsWith('Introduction:')) {
      if (currentField && currentValue) content[currentField] = currentValue.trim();
      currentField = 'introduction';
      currentValue = line.substring('Introduction:'.length).trim();
    } else if (line.startsWith('Concept:')) {
      if (currentField && currentValue) content[currentField] = currentValue.trim();
      currentField = 'concept';
      currentValue = line.substring('Concept:'.length).trim();
    } else if (line.startsWith('Why it matters:')) {
      if (currentField && currentValue) content[currentField] = currentValue.trim();
      currentField = 'whyItMatters';
      currentValue = line.substring('Why it matters:'.length).trim();
    } else if (line.startsWith('Breakdown:')) {
      if (currentField && currentValue) content[currentField] = currentValue.trim();
      currentField = 'breakdown';
      currentValue = line.substring('Breakdown:'.length).trim();
    } else if (line.startsWith('Example:')) {
      if (currentField && currentValue) content[currentField] = currentValue.trim();
      currentField = 'example';
      currentValue = line.substring('Example:'.length).trim();
    } else if (line.startsWith('Bad vs Good:')) {
      if (currentField && currentValue) content[currentField] = currentValue.trim();
      currentField = 'badVsGood';
      currentValue = line.substring('Bad vs Good:'.length).trim();
    } else if (line.startsWith('Common Mistakes:')) {
      if (currentField && currentValue) content[currentField] = currentValue.trim();
      currentField = 'commonMistakes';
      currentValue = line.substring('Common Mistakes:'.length).trim();
    } else if (line.startsWith('Practical Tips:')) {
      if (currentField && currentValue) content[currentField] = currentValue.trim();
      currentField = 'practicalTips';
      currentValue = line.substring('Practical Tips:'.length).trim();
    } else if (line.startsWith('Mini Activity:')) {
      if (currentField && currentValue) content[currentField] = currentValue.trim();
      currentField = 'miniActivity';
      currentValue = line.substring('Mini Activity:'.length).trim();
    } else if (line.startsWith('Summary:')) {
      if (currentField && currentValue) content[currentField] = currentValue.trim();
      currentField = 'summary';
      currentValue = line.substring('Summary:'.length).trim();
    } else if (currentField && line.trim()) {
      currentValue += '\n' + line;
    }
  }
  
  if (currentField && currentValue) content[currentField] = currentValue.trim();
  
  return content;
}

// Split content by sections
const uxStart = contentText.indexOf('UX Sections');
const uiStart = contentText.indexOf('UI Sections');
const uxuiStart = contentText.indexOf('UX × UI Integration');
const bonusStart = contentText.indexOf('Bonus Sections');

if (uxStart !== -1 && uiStart !== -1) {
  sections[0].topics = parseTopics(contentText.substring(uxStart + 11, uiStart));
}
if (uiStart !== -1 && uxuiStart !== -1) {
  sections[1].topics = parseTopics(contentText.substring(uiStart + 11, uxuiStart));
}
if (uxuiStart !== -1 && bonusStart !== -1) {
  sections[2].topics = parseTopics(contentText.substring(uxuiStart + 19, bonusStart));
}
if (bonusStart !== -1) {
  sections[3].topics = parseTopics(contentText.substring(bonusStart + 15));
}

// Write JSON
const output = { sections };
fs.writeFileSync('client/src/lib/pixelContent.json', JSON.stringify(output, null, 2), 'utf-8');

console.log(`✅ Generated content with ${sections.reduce((sum, s) => sum + s.topics.length, 0)} topics`);
sections.forEach(s => console.log(`  - ${s.nameEn}: ${s.topics.length} topics`));
