#!/bin/bash

username="your_username"
password="your_password"

git add .
git commit -m "$(date)"  # Use the current date as the commit message
echo -e "$username\n$password" | git push origin main
