from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class StaticS3Storage(S3Boto3Storage):
    def __init__(self, *args, **kwargs):
        kwargs['bucket_name'] = settings.AWS_STATIC_BUCKET_NAME
        kwargs['addressing_style'] = 'virtual'
        super(StaticS3Storage, self).__init__(*args, **kwargs)
