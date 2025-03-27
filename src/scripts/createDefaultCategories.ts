const { templateService } = require('../lib/firebase/templateService');

async function main() {
  try {
    console.log('Starting to create default categories...');
    await templateService.createDefaultCategories();
    console.log('Default categories created successfully');
  } catch (error) {
    console.error('Error creating default categories:', error);
  }
}

main(); 