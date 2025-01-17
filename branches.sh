#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Setting up branch protection rules for Nibblix...${NC}"

# Set repository name explicitly
REPO_NAME="rvph10/nibblix-app"

# Get GitHub token from gh cli
GITHUB_TOKEN=$(gh auth token)

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Failed to get GitHub token. Please make sure you're logged in with gh cli${NC}"
    exit 1
fi

# Function to configure branch protection
configure_branch_protection() {
    local branch=$1
    local required_reviews=$2
    local require_code_owner=$3
    local contexts=$4

    echo -e "${GREEN}Configuring protection for ${branch} branch...${NC}"
    
    # Create JSON payload
    local json_data=$(cat << EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ${contexts}
  },
  "enforce_admins": {
    "enabled": true
  },
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": ${require_code_owner},
    "required_approving_review_count": ${required_reviews}
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": true,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
EOF
)

    # Make the API call with curl
    response=$(curl -s -X PUT \
        -H "Accept: application/vnd.github+json" \
        -H "Authorization: Bearer ${GITHUB_TOKEN}" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        -H "Content-Type: application/json" \
        -d "$json_data" \
        "https://api.github.com/repos/${REPO_NAME}/branches/${branch}/protection")

    # Check if the response contains an error message
    if echo "$response" | grep -q "\"message\""; then
        echo -e "${RED}Failed to configure protection for ${branch} branch${NC}"
        echo -e "${RED}Error: $(echo "$response" | jq -r '.message')${NC}"
        return 1
    else
        echo -e "${GREEN}Successfully configured protection for ${branch} branch${NC}"
        return 0
    fi
}

# Configure main branch
main_contexts='["client/test","client/build","dependency-review","security-audit","server/test","server/build"]'
configure_branch_protection "main" 2 true "${main_contexts}" || exit 1

# Configure staging branch
staging_contexts='["client/test","client/build","server/test","server/build"]'
configure_branch_protection "staging" 1 false "${staging_contexts}" || exit 1

# Configure development branch
dev_contexts='["client/test","server/test"]'
configure_branch_protection "development" 1 false "${dev_contexts}" || exit 1

echo -e "${GREEN}Branch protection rules have been set up successfully!${NC}"