#!/bin/bash

# Function to calculate CPU usage percentage
calculate_cpu_usage() {
    # Get the initial CPU usage values from /proc/stat
    cpu_info=($(grep '^cpu ' /proc/stat))
    prev_idle=${cpu_info[4]}
    prev_total=$((prev_idle + ${cpu_info[1]} + ${cpu_info[2]} + ${cpu_info[3]} + ${cpu_info[5]} + ${cpu_info[6]} + ${cpu_info[7]} + ${cpu_info[8]}))
    
    while true; do
        # Get the updated CPU usage values from /proc/stat
        cpu_info=($(grep '^cpu ' /proc/stat))
        idle=${cpu_info[4]}
        total=$((idle + ${cpu_info[1]} + ${cpu_info[2]} + ${cpu_info[3]} + ${cpu_info[5]} + ${cpu_info[6]} + ${cpu_info[7]} + ${cpu_info[8]}))
        
        # Calculate the difference in CPU times
        idle_diff=$((idle - prev_idle))
        total_diff=$((total - prev_total))
        
        # Calculate the CPU usage percentage
        cpu_usage_percentage=$((100 * (total_diff - idle_diff) / total_diff))
        
        # Display the CPU usage percentage
        echo "CPU Usage: ${cpu_usage_percentage}%"
        
        # Update the previous values
        prev_idle=$idle
        prev_total=$total
        
        # Exit the loop after the first calculation
        break
    done
}

# Call the function to start monitoring CPU usage
calculate_cpu_usage
