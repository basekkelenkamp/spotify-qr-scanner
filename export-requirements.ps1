# Export dependencies to requirements.txt without hashes
poetry export -f requirements.txt --output requirements.txt --without-hashes

# Read the requirements.txt and remove everything after and including the first occurrence of ' ;'
(Get-Content requirements.txt) -replace '\s;\s.*', '' | Set-Content requirements.txt

# Stage the updated requirements.txt for commit
git add requirements.txt
