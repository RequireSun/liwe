#!/bin/sh
git filter-branch --env-filter '
OLD_EMAIL="OLD_EMAIL"
CORRECT_NAME="NEW_NAME"
CORRECT_EMAIL="NEW_EMAIL"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="RequireSun"
    export GIT_COMMITTER_EMAIL="kelvinlpsun@hotmail.com"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="RequireSun"
    export GIT_AUTHOR_EMAIL="kelvinlpsun@hotmail.com"
fi
' --tag-name-filter cat -- --branches --tags
