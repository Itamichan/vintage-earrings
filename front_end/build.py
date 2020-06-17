# this script was kindly written by sheepsy90 - https://github.com/sheepsy90

import subprocess
import sys
import datetime
import os
import gzip

PUBLIC_URL = os.environ.get('PUBLIC_URL', None)
GOOGLE_ANALYTICS = os.environ.get('GOOGLE_ANALYTICS', '')
STATIC_PREFIX = 'resources'

# Make sure the environment variables that are necessary are given
if PUBLIC_URL is None:
    print('Please provide a public url.')
    exit(1)

# Defining the configuration based on the environment variables
CONFIGURATION = {
    'REACT_APP_GOOGLE_TRACKING_CODE': GOOGLE_ANALYTICS
}

# Setting up all the variables we need during the build and deployment
ENVIRONMENT_VARIABLES = ["{}={}".format(key, value) for key, value in CONFIGURATION.items() if value]
ENVIRONMENT_VARIABLES.append("CI=false")

# Actually building the NPM production build
child = subprocess.Popen(
  ['env'] + ENVIRONMENT_VARIABLES + [f'PUBLIC_URL={PUBLIC_URL}', 'npm', 'run', 'build'], stdout=subprocess.PIPE)
child.communicate()
npm_build_return_code = child.returncode

# Check that the build processes worked properly
if npm_build_return_code:
    print(f'The build step failed. Abort building release build.')
    exit(1)

# Log that the npm build succeeded
print(f'Initial npm release build completed.')

# Define the public url without slash
PUBLIC_URL_WITHOUT_SLASH = PUBLIC_URL
if PUBLIC_URL.endswith('/'):
  PUBLIC_URL_WITHOUT_SLASH = PUBLIC_URL[:-1]

# A function that prefixes the resources path in the css with the public url so they are found
def prefix_css_file(file_path):
    with open(file_path, "r+") as f:
        data = f.read()
        data = data.replace("url(/{STATIC_PREFIX}/", f"url({PUBLIC_URL_WITHOUT_SLASH}/{STATIC_PREFIX}/")
        f.seek(0)
        f.write(data)
        f.truncate()

# Actually do the prefixing so the resources are referenced correctly
for file in os.listdir('./build/static/css/'):
    if file.endswith('.map'):
        continue

    prefix_css_file(os.path.join('./build/static/css/', file))

# A function compressing the file with gzip
def compress(file_path):
  with open(file_path, 'rb') as file:
    content = file.read()

  with gzip.open('{}.gz'.format(file_path), 'wb') as gzfile:
    gzfile.write(content)

# Getting all the static files that are created during the build
static_files = []
for r, dir, files in os.walk('./build/static/'):
  for f in files:
    static_files += [os.path.join(r, f)]

# Filter them so we have js and css files
js_files = [e for e in static_files if e.endswith('.js')]
css_files = [e for e in static_files if e.endswith('.css')]

# Compress all of them
for file in js_files+css_files:
  compress(file)

# Opening the index page and replace the js and css links with gz links if they are referenced
with open('build/index.html', 'r+') as f:
  content = f.read()
  content = content.replace('<!DOCTYPE doctype html>', '<!DOCTYPE html>')
  content = content.replace('.chunk.js', '.chunk.js.gz')
  content = content.replace('.chunk.css', '.chunk.css.gz')

  for path in js_files:
    content = content.replace(path, f'{path}.gz')

  f.seek(0)
  f.write(content)
  f.truncate()

# If we are using code splitting we need to find the runtime-main and add the .gz ending to the chunks
runtime_main_path = [e for e in static_files if "runtime-main" in e and e.endswith('.js')]

if runtime_main_path:
    with open(runtime_main_path[0], "r+") as f:
      content = f.read()
      content = content.replace('.chunk.js', '.chunk.js.gz')
      content = content.replace('.chunk.css', '.chunk.css.gz')
      f.seek(0)
      f.write(content)
      f.truncate()

print(f'Build successful!')