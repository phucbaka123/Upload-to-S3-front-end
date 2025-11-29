# Upload-to-S3-front-end
This project demonstrates how to upload files directly from the browser to an AWS S3 bucket using a presigned URL. A small Node.js backend generates the presigned PUT URL, and the browser uses it to upload the file without sending the file through the server.

# Why this method is convenient
Normally, when a user uploads an image, it has to go from user -> server -> S3. People have to pay for bandwidth, and it cost more and make the whole process slower. In this project, user is able to upload and get the image directly to S3 by creating a secret temporary link from server. The server barely do anything, it just give a signed URL (like a shortcut), this make the procedure fast, cheap, scalable. 

# This is the way it work:

textUser clicks "Upload"
       ↓
Browser → Your backend: "Hey, give me a signed URL for a new image"
       ↓
Your backend → Amazon S3: "Please give me a one-time upload link"
       ↓
Your backend → Browser: "Here is the secret link: https://bucket.s3... (expires in 60s)"
       ↓
Browser → Amazon S3 (directly): PUT the big image file using that link
       ↓
Amazon S3: "Upload successful!"
       ↓
(Optional) Browser → Your backend: "Image is uploaded, here is the final URL"
       ↓
Your backend: Save the URL + caption + user ID into your database



#How to get the access key and secret access key (used for .env later on)?

1. Create S3 Bucket

-Sign in to AWS
-Open S3
-Create a new bucket
-Choose the correct region (used in s3.js)
-Keep Block Public Access on unless you want files publicly viewable
-Create bucket
-Bucket Policy
-Open the bucket → Permissions → Bucket Policy → Edit
-Go to: https://awspolicygen.s3.amazonaws.com/policygen.html
-Select:
S3 Bucket Policy
Allow
Principal: *
Action: GetObject
ARN: arn:aws:s3:::YOUR_BUCKET_NAME/*
Generate policy and paste it into Bucket Policy

CORS Configuration
-Paste this into CORS:
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "HEAD", "GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]

2. Create IAM User

-Open IAM
-Go to Policies → Create Policy
-Choose S3
-Add action: PutObject
-Add resource ARN: arn:aws:s3:::YOUR_BUCKET_NAME/*
-Create policy

-Create IAM User
-Go to Users → Add User
-Choose Access key for programmatic access
-Attach the policy created above
-Create user
-Copy the access key and secret key
-Add to .env


#Role of each file
#Front end:
1. index.html
Purpose: Display a from, load index.js, file input, upload button and place to show uploaded images
2. index.js
Purpose: The brain of the front end, the user click submit -> ask backend for URL, upload file directly to S3

#Back end:
1. server.js
Purpose: This is a server that has route /s3Url -> calls the function in s3.js
2. s3.js
Purpose: Talk to Amazon AWS using for key and your secret key, return a temporary signed URL
3. .env
Purpose: Store the access key and secret key
4. package.json
Purpose: Tell Node what packages to install


