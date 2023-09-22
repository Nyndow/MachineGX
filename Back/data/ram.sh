#!/bin/bash

# Get total memory from /proc/meminfo
total_memory_kb=$(grep -i "MemTotal" /proc/meminfo | awk '{print $2}')

# Get free memory from /proc/meminfo
free_memory_kb=$(grep -i "MemFree" /proc/meminfo | awk '{print $2}')

# Convert memory values to gigabytes
total_memory_gb=$(echo "scale=2; $total_memory_kb / 1024 / 1024" | bc)
free_memory_gb=$(echo "scale=2; $free_memory_kb / 1024 / 1024" | bc)

# Display the results
echo "Total Memory: ${total_memory_gb} GB"
echo "Free Memory: ${free_memory_gb} GB"
