#!/bin/bash
# Log start time
echo "Starting daily task at $(date)"

# Navigate to project directory
cd /Users/ninja/Documents/law || exit 1

# Run the keyword queue script
/Users/ninja/.nvm/versions/node/v22.21.1/bin/node scripts/keyword-queue.mjs

# Log end time
echo "Finished daily task at $(date)"
