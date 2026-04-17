const fs = require('fs');
const path = require('path');

const dirs = [
  'd:/THIS IS WHERE THE STORY END/src/pages',
  'd:/THIS IS WHERE THE STORY END/src/components'
];

const replacements = [
  { regex: /backgroundColor:\s*['"]#ffffff['"]/gi, replace: "backgroundColor: 'var(--bg-card)'" },
  { regex: /backgroundColor:\s*['"]#fff['"]/gi, replace: "backgroundColor: 'var(--bg-card)'" },
  { regex: /backgroundColor:\s*['"]white['"]/gi, replace: "backgroundColor: 'var(--bg-card)'" },
  { regex: /background:\s*['"]#ffffff['"]/gi, replace: "background: 'var(--bg-card)'" },
  { regex: /background:\s*['"]#fff['"]/gi, replace: "background: 'var(--bg-card)'" },
  { regex: /background:\s*['"]white['"]/gi, replace: "background: 'var(--bg-card)'" },
  { regex: /backgroundColor:\s*['"]#f9fafb['"]/gi, replace: "backgroundColor: 'var(--bg-page)'" },
  { regex: /backgroundColor:\s*['"]#f5f5f5['"]/gi, replace: "backgroundColor: 'var(--bg-page)'" },
  { regex: /background:\s*['"]#f9fafb['"]/gi, replace: "background: 'var(--bg-page)'" },
  { regex: /background:\s*['"]#f5f5f5['"]/gi, replace: "background: 'var(--bg-page)'" },

  // pure black button fixes
  { regex: /backgroundColor:\s*['"]#000['"]/gi, replace: "backgroundColor: 'var(--text-main)'" },
  { regex: /color:\s*['"]#fff['"]/gi, replace: "color: 'var(--bg-card)'" }, 

  // CSS standard files
  { regex: /background-color:\s*#ffffff;/gi, replace: "background-color: var(--bg-card);" },
  { regex: /background-color:\s*#fff;/gi, replace: "background-color: var(--bg-card);" },
  { regex: /background:\s*#ffffff;/gi, replace: "background: var(--bg-card);" },
  { regex: /background:\s*#fff;/gi, replace: "background: var(--bg-card);" },
  { regex: /background-color:\s*#f9fafb;/gi, replace: "background-color: var(--bg-page);" },
  
  // Specific override for Login.jsx? We'll just leave it and see.
];

dirs.forEach(dir => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.jsx') || file.endsWith('.css')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Specifically avoid replacing #fff color in App.css or wherever var(--accent) is
      if(file === 'index.css' || file === 'App.css') return;

      replacements.forEach(r => {
         // ONLY replace color: #fff if it's next to something or we are in a button?
         // Actually I'll let it globally replace because most #fff text is inside absolute black buttons.
         // Wait! Status badges! The status badge has color: #fff. A green badge with var(--bg-card) text gets dark text. That's fine! 
        content = content.replace(r.regex, r.replace);
      });
      fs.writeFileSync(filePath, content);
    }
  });
});

console.log('done phase 2');
