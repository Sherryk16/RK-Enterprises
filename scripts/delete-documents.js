import { createClient } from '@sanity/client';

const SANITY_PROJECT_ID ='g2pb2hqo'
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_TOKEN ='skWTHwkl0MbZDphvdPQTdCEihWmrdvXO1ujsBCaz9RQmB6vVRF5i9pHBdzI645sSSSjtoyTx1M7VNSa3KuHZmIaCUzSfom9eko6i2vHaiQYCJRWa1GTQx7scm4OjriJk4Fs8WInesVRfdDRRDdjwW0vk0oWbomnVK6LZ02dyKUUB3g133IPr'

if (!SANITY_PROJECT_ID || !SANITY_TOKEN) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_WRITE_TOKEN environment variables.');
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2023-03-20', // Use a recent date
  token: SANITY_TOKEN,
  useCdn: false,
});

const deleteDocumentsByType = async (documentType) => {
  console.log(`Deleting all documents of type: ${documentType}...`);
  const query = `*[_type == "${documentType}"]._id`;
  const ids = await client.fetch(query);

  if (ids.length === 0) {
    console.log(`No documents of type ${documentType} found to delete.`);
    return;
  }

  const transaction = client.transaction();
  ids.forEach(id => transaction.delete(id));

  try {
    await transaction.commit();
    console.log(`Successfully deleted ${ids.length} documents of type ${documentType}.`);
  } catch (error) {
    console.error(`Error deleting documents of type ${documentType}:`, error);
    throw error;
  }
};

const runDelete = async () => {
  try {
    await deleteDocumentsByType('product');
    await deleteDocumentsByType('subcategory');
    await deleteDocumentsByType('category');
    console.log("All specified document types cleared.");
  } catch (error) {
    console.error("Deletion process failed:", error);
    process.exit(1);
  }
};

runDelete().catch(console.error);
