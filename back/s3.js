//All code used to connect to aws
import dotenv from 'dotenv'
import aws from 'aws-sdk'
import crypto from 'crypto'
import { promisify } from "util"


dotenv.config({ path: './back/.env' })
const randomBytes = promisify(crypto.randomBytes)

const region = "us-east-2"
const bucketName = "direct-upload-projects"
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY


const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
});

export async function generateUploadURL() {
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');

    const params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 60, // seconds
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}