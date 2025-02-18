// const { Storage } = require('@google-cloud/storage');
import { Storage } from '@google-cloud/storage';
// Creates a client using Application Default Credentials (ensure you are authenticated)
const storage = new Storage();

async function setCors() {
  const bucketName = 'edmund-schiefeling.firebasestorage.app'; // e.g., 'edmund-schiefeling.firebasestorage.app'
  const bucket = storage.bucket(bucketName);

  const corsConfiguration = [
    {
      origin: ['*'], // Add additional origins if needed
      method: ['GET'],
      responseHeader: ['Content-Type'],
      maxAgeSeconds: 3600,
    },
  ];

  try {
    await bucket.setCorsConfiguration(corsConfiguration);
    console.log('CORS configuration updated successfully.');
  } catch (error) {
    console.error('Error updating CORS configuration:', error);
  }
}

setCors();
