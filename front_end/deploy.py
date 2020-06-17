# this script was kindly written by sheepsy90 - https://github.com/sheepsy90

import gzip
import os
import sys
import boto3

AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY', None)
AWS_SECRET_KEY = os.environ.get('AWS_SECRET_KEY', None)
AWS_BUCKET = os.environ.get('AWS_BUCKET', None)

# Making sure the access key and the secret key are set
if not all([AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET]):
    print("One of the required environment variables is not set.")
    exit(1)

# Having the S3 Client to upload the files
S3_CLIENT = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)


def upload(_from, _to):
  print(f'Uploading: {_from}')

  with open(_from, 'rb') as f:
    upload_flags = {
      'ContentType': 'string',
      'CacheControl': 'max-age=31557600'
    }

    if _from.endswith('.js.gz'):
      upload_flags['ContentType'] = 'application/javascript'
      upload_flags['ContentEncoding'] = 'gzip'

    if _from.endswith('.css.gz'):
      upload_flags['ContentType'] = 'text/css'
      upload_flags['ContentEncoding'] = 'gzip'

    if _from.endswith('.css'):
      upload_flags['ContentType'] = 'text/css'

    if _from.endswith('.svg'):
      upload_flags['ContentType'] = 'image/svg+xml'

    if _from.endswith('.js'):
      upload_flags['ContentType'] = 'application/x-javascript'

    if _from.endswith('.pdf'):
      upload_flags['ContentType'] = 'application/pdf'

    if _from.endswith('.png'):
      upload_flags['ContentType'] = 'image/png'

    if _from.endswith('.jpeg') or _from.endswith('.jpg'):
      upload_flags['ContentType'] = 'image/jpeg'

    if _from.endswith('index.html'):
      upload_flags['ContentType'] = 'text/html'
      upload_flags['CacheControl'] = 'no-cache'

    print(upload_flags)

    S3_CLIENT.put_object(
      ACL="public-read", Body=f.read(), Bucket=AWS_BUCKET, Key=_to, **upload_flags)


for _, _, files in os.walk('build/static/css'):
  for file in files:
    if not file.endswith('.css'):
      upload('./build/static/css/{}'.format(file), 'static/css/{}'.format(file))

for _, _, files in os.walk('./build/static/js'):
  for file in files:
    if not file.endswith('.js'):
      upload('./build/static/js/{}'.format(file), 'static/js/{}'.format(file))

# Upload all the new assets
for path, _, files in os.walk('build/'):
  for file in files:
    from_path = os.path.join(path, file)
    to_path = from_path[6:]

    # Don't upload the index.html yet
    if from_path != 'build/index.html':
      upload(from_path, to_path)

# Upload the index.html last
upload('build/index.html', 'index.html')

print("Deployment completed")