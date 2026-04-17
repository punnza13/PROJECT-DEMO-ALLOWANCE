const fs = require('fs');
const path = require('path');

const dir = 'd:/THIS IS WHERE THE STORY END/src/pages';
const files = ['CreateRequest.jsx', 'CreateRequestOwner.jsx'];

const replacements = [
  // color replacements
  { regex: /color:\s*#111;/gi, replace: "color: var(--text-main);" },
  { regex: /color:\s*#111827;/gi, replace: "color: var(--text-main);" },
  { regex: /color:\s*#888;/gi, replace: "color: var(--text-muted);" },
  { regex: /color:\s*#6B7280;/gi, replace: "color: var(--text-muted);" },
  { regex: /color:\s*#4B5563;/gi, replace: "color: var(--text-muted);" },
  { regex: /color:\s*#9CA3AF;/gi, replace: "color: var(--text-muted);" },
  { regex: /color:\s*#374151;/gi, replace: "color: var(--text-main);" },

  // background replacements that missed
  { regex: /background(?:-color)?:\s*#ffffff;/gi, replace: "background-color: var(--bg-card);" },
  { regex: /background(?:-color)?:\s*#fff;/gi, replace: "background-color: var(--bg-card);" },
  { regex: /background(?:-color)?:\s*#F9FAFB;/gi, replace: "background-color: var(--bg-page);" },
  { regex: /background(?:-color)?:\s*#fcfcfc;/gi, replace: "background-color: var(--bg-page);" },
  { regex: /background: #fff;/gi, replace: "background-color: var(--bg-card);" },
  { regex: /background:\s*#ffffff;/gi, replace: "background-color: var(--bg-card);" },
  
  // Exception handling for CreateRequest specifically since regex might miss if not terminated strictly
  { regex: /style={{ background: '#fcfcfc', border: 'none' }}/gi, replace: "style={{ background: 'var(--bg-page)', border: 'none' }}" },
  
  // borders
  { regex: /border-top:\s*1px solid #eaeaea;/gi, replace: "border-top: 1px solid var(--border-color);" },
  { regex: /border:\s*1px solid #eaeaea;/gi, replace: "border: 1px solid var(--border-color);" },
  { regex: /border-bottom:\s*1px solid #eaeaea;/gi, replace: "border-bottom: 1px solid var(--border-color);" },
  { regex: /border:\s*1px solid #F3F4F6;/gi, replace: "border: 1px solid var(--border-color);" },
  { regex: /border:\s*1px solid #D1D5DB;/gi, replace: "border: 1px solid var(--border-color);" },
  { regex: /border-bottom:\s*1px solid #E5E7EB;/gi, replace: "border-bottom: 1px solid var(--border-color);" },
  { regex: /border-right:\s*1px solid #E5E7EB;/gi, replace: "border-right: 1px solid var(--border-color);" },
  { regex: /border-bottom:\s*1px solid #9CA3AF;/gi, replace: "border-bottom: 1px solid var(--border-color);" }
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if(fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    replacements.forEach(r => {
      content = content.replace(r.regex, r.replace);
    });
    fs.writeFileSync(filePath, content);
  }
});
