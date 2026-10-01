/**
 * Grammar Data Title Renamer
 * 
 * Aa script grammar-data-part1.js ane grammar-data-part2.js ma
 * badha topic titles ne copyright-safe names ma badalshe.
 * 
 * Usage: node rename-titles.js
 * 
 * Features:
 * ✅ Bey files handle karshe (part1 + part2)
 * ✅ Backup banavshe
 * ✅ Line count check karshe
 * ✅ Verification karshe
 * ✅ Report banavshe
 * ✅ Missing titles batavshe
 * ✅ Auto-detect karshe jo pehla thi badlayelu hoy
 */

const fs = require('fs');
const path = require('path');

// ===== CONFIG =====
const FILES = ['grammar-data-part1.js', 'grammar-data-part2.js'];
const BACKUP_SUFFIX = '.backup';

// ===== TITLE REPLACEMENTS (BADHA 70) =====
// Format: 'juni title' : 'navi title'
const REPLACEMENTS = {
    // ===== PART 1 (Topics 1-33) =====
    'Basic English': 'English Basics',
    'Singular - Plural': 'One and Many',
    'Articles (A, An, The)': 'Learning Articles',
    'Parts of Speech': 'All About Words',
    'To be (am/is/are, was/were, will be)': 'Being Words',
    'To have (have/has, had, will have)': 'Having Words',
    'Use of There': 'There in Sentences',
    'Question Words': 'Asking Questions',
    'Simple Present Tense': 'Daily Actions',
    'Simple Past Tense': 'Past Actions',
    'Simple Future Tense': 'Future Actions',
    'Rule of ing': 'Adding -ing',
    'Continuous Present Tense': 'Happening Now',
    'Continuous Past Tense': 'Was Happening',
    'Continuous Future Tense': 'Will Be Happening',
    'Present Perfect Tense': 'Just Finished',
    'Past Perfect Tense': 'Already Finished',
    'Future Perfect Tense': 'Will Have Finished',
    'Present Perfect Continuous Tense': 'Still Happening',
    'Past Perfect Continuous Tense': 'Was Still Happening',
    'Future Perfect Continuous Tense': 'Will Still Be Happening',
    'Use of Want': 'Wishing and Wanting',
    'Has to, Have to, Had to, Will have to': 'Must Do Words',
    'Imperative Sentences': 'Command Sentences',
    'Would like to': 'Polite Wishes',
    "Let & Let's": 'Allowing and Suggesting',
    'Degree of Comparison': 'Comparing Things',
    'Modal Verbs (Can, Could, Should, Would, May, Might, Must)': 'Helping Verbs',
    'Active - Passive Voice': 'Doer and Action',
    'Spelling Club': 'Days, Months, Numbers',
    'Rules of Silent Letters': 'Silent Letters',
    'Rules of Pronunciation': 'Sound Rules',
    'Interview Preparation': 'Interview Skills',

    // ===== PART 2 (Topics 34-70) - Tame part2 na juno titles ahiya add karo =====
    // Example:
    // 'Unit 1 Grammar': 'Basic Grammar',
    // 'Unit 2 Grammar': 'Advanced Grammar',
    // ... (badha part2 na titles ahiya add karo)
};

// ===== SCRIPT START =====
console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║   📝 Grammar Data Title Renamer Script              ║');
console.log('║   Copyright-Safe Titles                             ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

let totalFiles = 0;
let totalReplacements = 0;
let totalMissing = 0;
let totalSkipped = 0;

FILES.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);

    // Check file exists
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${fileName}\n`);
        return;
    }

    totalFiles++;
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📖 Processing: ${fileName}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // Read file
    let content = fs.readFileSync(filePath, 'utf8');
    const beforeLines = content.split('\n').length;
    const beforeSize = fs.statSync(filePath).size;
    console.log(`📏 Before: ${beforeLines} lines, ${(beforeSize / 1024).toFixed(1)} KB`);

    // Backup banavo
    const backupPath = filePath + BACKUP_SUFFIX;
    if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, content, 'utf8');
        console.log(`💾 Backup: ${fileName}${BACKUP_SUFFIX}`);
    } else {
        console.log(`💾 Backup already exists: ${fileName}${BACKUP_SUFFIX}`);
    }

    // Replace titles
    let replaceCount = 0;
    let missingCount = 0;
    let skippedCount = 0;

    for (const [oldTitle, newTitle] of Object.entries(REPLACEMENTS)) {
        const oldPattern = `title: "${oldTitle}"`;
        const newPattern = `title: "${newTitle}"`;

        // Check jo navu title pehla thi chhe (already renamed)
        if (content.includes(newPattern)) {
            skippedCount++;
            continue;
        }

        // Replace
        if (content.includes(oldPattern)) {
            content = content.replace(oldPattern, newPattern);
            replaceCount++;
            console.log(`  ✅ ${oldTitle.substring(0, 45)}`);
        } else {
            // Check jo single quote ma hoy
            const oldPatternSingle = `title: '${oldTitle}'`;
            const newPatternSingle = `title: '${newTitle}'`;
            if (content.includes(oldPatternSingle)) {
                content = content.replace(oldPatternSingle, newPatternSingle);
                replaceCount++;
                console.log(`  ✅ ${oldTitle.substring(0, 45)}`);
            } else {
                missingCount++;
                console.log(`  ⚠️  Not found: ${oldTitle.substring(0, 45)}`);
            }
        }
    }

    // Write file
    fs.writeFileSync(filePath, content, 'utf8');

    // Verify
    const afterLines = content.split('\n').length;
    const afterSize = fs.statSync(filePath).size;
    console.log(`\n📏 After: ${afterLines} lines, ${(afterSize / 1024).toFixed(1)} KB`);
    console.log(`✅ Replaced: ${replaceCount}`);
    console.log(`⏭️  Skipped (already renamed): ${skippedCount}`);
    console.log(`⚠️  Missing: ${missingCount}`);

    if (beforeLines === afterLines) {
        console.log(`✅ Line count SAME — koi content cut nathi thayu!`);
    } else {
        console.log(`⚠️  Line count CHANGED: ${beforeLines} → ${afterLines}`);
    }

    totalReplacements += replaceCount;
    totalMissing += missingCount;
    totalSkipped += skippedCount;
});

// ===== FINAL REPORT =====
console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║   📊 FINAL REPORT                                   ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log(`📁 Files processed: ${totalFiles}`);
console.log(`✅ Total replacements: ${totalReplacements}`);
console.log(`⏭️  Total skipped: ${totalSkipped}`);
console.log(`⚠️  Total missing: ${totalMissing}`);

if (totalMissing > 0) {
    console.log(`\n⚠️  Ketlak titles nathi malya. Tamari file ma juno title check karo.`);
}

console.log('\n🎉 Script complete!\n');
console.log('📋 Next steps:');
console.log('   1. App test karo: npx electron .');
console.log('   2. GitHub push karo: git add . && git commit -m "Rename titles" && git push');
console.log('   3. Jo kai problem hoy, to backup restore karo:');
console.log('      copy grammar-data-part1.js.backup grammar-data-part1.js\n');