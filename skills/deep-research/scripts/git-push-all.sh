#!/bin/bash
# Deep Research Skill -- Multi-Repo Git Push
# Commits and pushes changes to all tracked repositories
# Usage: git-push-all.sh [wave_number] "[summary]"
set -uo pipefail

WAVE="${1:-0}"
SUMMARY="${2:-Auto-commit from deep research wave}"

# --- Tracked Repositories ---
declare -A REPO_PATHS REPO_BRANCHES
REPO_PATHS=(
    ["deep-research"]="D:\\Bingaman Master Files Old\\Home Base Claude\\deep-research"
    ["dhs-public-records-filing"]="D:\\Bingaman Master Files Old\\Home Base Claude\\dhs-public-records-filing"
)
REPO_BRANCHES=(
    ["deep-research"]="claude/setup-apify-client-2OEPU"
    ["dhs-public-records-filing"]="master"
)

echo "=== Multi-Repo Git Push (Wave $WAVE) ==="
echo ""

FAILED=false

for REPO_NAME in "${!REPO_PATHS[@]}"; do
    REPO_PATH="${REPO_PATHS[$REPO_NAME]}"
    BRANCH="${REPO_BRANCHES[$REPO_NAME]}"

    echo "--- $REPO_NAME ---"
    echo "  Path:   $REPO_PATH"
    echo "  Branch: $BRANCH"

    if ! cd "$REPO_PATH" 2>/dev/null; then
        echo "  [FAIL] Cannot access repo directory"
        FAILED=true
        echo ""
        continue
    fi

    # Check for changes (staged, unstaged, and untracked)
    CHANGES=$(git status --porcelain 2>/dev/null | wc -l)

    if [ "$CHANGES" -eq 0 ]; then
        echo "  [NO CHANGES] Nothing to commit"
        echo ""
        continue
    fi

    echo "  [DETECTED] $CHANGES file(s) changed"

    # Stage all changes
    if ! git add -A 2>/dev/null; then
        echo "  [FAIL] git add failed"
        FAILED=true
        echo ""
        continue
    fi

    # Commit
    COMMIT_MSG="Wave $WAVE: $SUMMARY"
    if [ "$REPO_NAME" != "deep-research" ]; then
        COMMIT_MSG="$SUMMARY (via deep-research wave $WAVE)"
    fi

    if ! git commit -m "$COMMIT_MSG

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>" 2>/dev/null; then
        echo "  [FAIL] git commit failed"
        FAILED=true
        echo ""
        continue
    fi

    echo "  [COMMITTED] $COMMIT_MSG"

    # Pull before push (handles multiple machines)
    if ! git pull origin "$BRANCH" --no-rebase 2>/dev/null; then
        echo "  [WARN] git pull had issues -- attempting push anyway"
    fi

    # Push
    if git push origin "$BRANCH" 2>/dev/null; then
        echo "  [PUSHED] Successfully pushed to origin/$BRANCH"
    else
        echo "  [FAIL] git push failed"
        FAILED=true
    fi

    echo ""
done

echo "=== Summary ==="
if [ "$FAILED" = true ]; then
    echo "  RESULT: SOME REPOS FAILED -- check output above"
    exit 1
else
    echo "  RESULT: ALL REPOS UP TO DATE"
    exit 0
fi
