import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

export const BUCKET_NAME = 'todo-images';

const bucketPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Action: ['s3:GetObject'],
      Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
    }
  ]
};

export const initMinio = async (): Promise<void> => {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME);
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(bucketPolicy));
      console.log('✅ MinIO bucket created successfully with public access policy');
    } else {
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(bucketPolicy));
      console.log('✅ MinIO bucket policy updated');
    }
  } catch (error) {
    console.error('❌ MinIO initialization error:', error);
    throw error;
  }
};

export default minioClient; 