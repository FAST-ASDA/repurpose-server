const dotenv = require('dotenv');
dotenv.config();
const aws = require('aws-sdk')

const s3 = new aws.S3({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadS3 = (file, filesArray) => {
	return new Promise((resolve, reject) => {
	  let extension = file.name.split('.');
	  extension = extension[extension.length - 1];
	  const fileName = file.name.replace(/\W+(?!$)/g, '-').replace(/\W$/, '').toLowerCase() + '.' + extension;
	  const key = `${Date.now()}_${fileName}` ;
	  s3.putObject({
		Key: key,
		Body: file.data,
		Bucket: `${process.env.AWS_BUCKET}/productImages`,
		ACL: 'public-read'
	  }, err => {
		if (err) {
		  console.log('error:', err);
		  reject(err);
		}
		else {
		  resolve(filesArray.push(key))
		}
	  })
	})
}
module.exports = {
	uploadS3,
};