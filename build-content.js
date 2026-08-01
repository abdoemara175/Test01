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
  const topicRegex = /\d+\.\s+([^\n]+)\n\n"([\s\S]*?)"/g;
  let match;
  
  while ((match = topicRegex.exec(sectionText)) !== null) {
    const title = match[1];
    const contentBlock = match[2];
    
    // Extract each field
    const extractField = (fieldName) => {
      const regex = new RegExp(`${fieldName}:\\n([\\s\\S]*?)(?=\\n\\n[A-Z]|$)`);
      const fieldMatch = regex.exec(contentBlock);
      return fieldMatch ? fieldMatch[1].trim() : '';
    };
    
    const topicId = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .substring(0, 50);
    
    topics.push({
      id: topicId,
      titleAr: title,
      titleEn: title,
      content: {
        introduction: extractField('Introduction'),
        concept: extractField('Concept'),
        whyItMatters: extractField('Why it matters'),
        breakdown: extractField('Breakdown'),
        example: extractField('Example'),
        badVsGood: extractField('Bad vs Good'),
        commonMistakes: extractField('Common Mistakes'),
        practicalTips: extractField('Practical Tips'),
        miniActivity: extractField('Mini Activity'),
        summary: extractField('Summary')
      }
    });
  }
  
  return topics;
}

// Split content by sections
const uxMatch = contentText.match(/UX Sections([\s\S]*?)UI Sections/);
const uiMatch = contentText.match(/UI Sections([\s\S]*?)UX × UI Integration/);
const uxuiMatch = contentText.match(/UX × UI Integration([\s\S]*?)Bonus Sections/);
const bonusMatch = contentText.match(/Bonus Sections([\s\S]*?)$/);

if (uxMatch) sections[0].topics = parseTopics(uxMatch[1]);
if (uiMatch) sections[1].topics = parseTopics(uiMatch[1]);
if (uxuiMatch) sections[2].topics = parseTopics(uxuiMatch[1]);
if (bonusMatch) sections[3].topics = parseTopics(bonusMatch[1]);

// Write JSON
const output = { sections };
fs.writeFileSync('client/src/lib/pixelContent.json', JSON.stringify(output, null, 2), 'utf-8');

console.log(`✅ Generated content with ${sections.reduce((sum, s) => sum + s.topics.length, 0)} topics`);
sections.forEach(s => console.log(`  - ${s.nameEn}: ${s.topics.length} topics`));
