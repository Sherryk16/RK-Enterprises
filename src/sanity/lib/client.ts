import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false to enable writing data
  token: process.env.SANITY_WRITE_TOKEN, // Use the correct environment variable name here
})
