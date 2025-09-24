#!/usr/bin/env node

const { migrateExistingData } = require('../src/lib/migrate.ts')
const fs = require('fs')
const path = require('path')

async function setupCMS() {
  console.log('🚀 Setting up Ode Islands CMS...\n')

  // Create data directory
  const dataDir = path.join(process.cwd(), 'data/cms')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
    console.log('✓ Created CMS data directory')
  }

  // Run migration
  try {
    console.log('\n📦 Migrating existing content...')
    await migrateExistingData()
    console.log('✓ Content migration completed')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }

  console.log(`
🎉 CMS Setup Complete!

Next steps:
1. Start your development server: npm run dev
2. Visit http://localhost:3000/cms/login
3. Login with: admin@odeislands.com / admin123
4. Start managing your content!

Features:
• Add/edit/delete chapters and cards
• Rich content editor with themes
• Preview changes before publishing
• Export to live site
• User authentication

Enjoy managing your Ode Islands content! 🌊
`)
}

setupCMS().catch(console.error)