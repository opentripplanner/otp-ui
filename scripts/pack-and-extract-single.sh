#!/bin/sh
set -e

# Get package name from current directory
PACKAGE_NAME=$(basename "$(pwd)")

# Run pnpm pack to create the tarball
echo "Packing $PACKAGE_NAME..."
pnpm pack

# Find the generated tarball (should only be one)
TARBALL=$(ls *.tgz)
if [ -z "$TARBALL" ]; then
  echo "Error: No .tgz file found in $(pwd)"
  exit 1
fi

# Define and create the target temporary directory
TEMP_DIR_BASE="/tmp/otp-ui-pkg"
TEMP_DIR="$TEMP_DIR_BASE/$PACKAGE_NAME"
mkdir -p "$TEMP_DIR"

# Extract the tarball to the temporary directory
# The --strip-components=1 removes the leading 'package/' directory from the tarball paths
echo "Extracting $TARBALL to $TEMP_DIR"
tar -xzf "$TARBALL" -C "$TEMP_DIR" --strip-components=1

# Clean up the tarball in the package directory
rm "$TARBALL"

# Print the path to the temporary directory
echo "Successfully extracted $PACKAGE_NAME to: $TEMP_DIR" 