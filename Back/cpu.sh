#!/bin/bash

# Function to calculate total CPU usage
calculate_cpu_usage() {
    # Read the initial values from /proc/stat
    read -r cpu_stats < /proc/stat
    prev_total=0
    prev_idle=0

    while true; do
        # Read the updated values from /proc/stat
        read -r cpu_stats < /proc/stat

        # Extract CPU usage statistics
        user=$(( $(echo "$cpu_stats" | awk '{print $2}') ))
        nice=$(( $(echo "$cpu_stats" | awk '{print $3}') ))
        system=$(( $(echo "$cpu_stats" | awk '{print $4}') ))
        idle=$(( $(echo "$cpu_stats" | awk '{print $5}') ))
        iowait=$(( $(echo "$cpu_stats" | awk '{print $6}') ))
        irq=$(( $(echo "$cpu_stats" | awk '{print $7}') ))
        softirq=$(( $(echo "$cpu_stats" | awk '{print $8}') ))
        steal=$(( $(echo "$cpu_stats" | awk '{print $9}') ))
        guest=$(( $(echo "$cpu_stats" | awk '{print $10}') ))

        # Calculate total CPU time
        total=$((user + nice + system + idle + iowait + irq + softirq + steal + guest))

        # Calculate the difference in total CPU time
        total_diff=$((total - prev_total))
        idle_diff=$((idle - prev_idle))

        # Calculate CPU usage percentage
        cpu_usage_percentage=$((100 * (total_diff - idle_diff) / total_diff))

        # Display CPU usage percentage
        echo "CPU Usage: ${cpu_usage_percentage}%"

        # Update previous values
        prev_total=$total
        prev_idle=$idle

        # Sleep for a while (adjust as needed)
        sleep 0.5
    done
}

# Start calculating CPU usage
calculate_cpu_usage
