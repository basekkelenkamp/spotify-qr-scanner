# Export dependencies to requirements.txt without hashes
poetry export -f requirements.txt --output requirements.txt --without-hashes

# Read the requirements.txt and remove lines with 'python_full_version' conditions
(Get-Content requirements.txt) -replace '\s;\s*.*?python_full_version\s*==\s*".*?"(\s*and\s*.*?|\s*or\s*.*?)*', '' | Set-Content requirements.txt

# Stage the updated requirements.txt for commit
git add requirements.txt
