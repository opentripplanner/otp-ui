#!/bin/bash

# Script to add/remove a blank line in each package's README.md file
# or create a new README.md file if it doesn't exist

for pkg_dir in packages/*/; do
  # Skip the scripts directory
  if [[ "$pkg_dir" == "packages/scripts/" ]]; then
    continue
  fi
  
  pkg_name=$(basename "$pkg_dir")
  readme_path="${pkg_dir}README.md"
  
  echo "Processing $pkg_name..."
  
  if [ -f "$readme_path" ]; then
    echo "  README.md exists, modifying..."
    
    # Add a comment line to ensure a change is made
    echo "<!-- Updated for semantic release trigger -->" >> "$readme_path"
    echo "  Added comment to $readme_path"
  else
    echo "  README.md doesn't exist, creating..."
    # Create a new README.md file with package name as title
    echo "# $pkg_name" > "$readme_path"
    echo "" >> "$readme_path"
    echo "Package for OTP-UI." >> "$readme_path"
    echo "" >> "$readme_path"
    echo "<!-- Created for semantic release trigger -->" >> "$readme_path"
    echo "  Created new README.md for $pkg_name"
  fi
done

echo "All README.md files have been updated!" 