#!/bin/bash
calculate_cpu_usage() {
    # Get the initial CPU usage values from /proc/stat
    cpu_info=($(grep '^cpu ' /proc/stat))
    prev_idle=${cpu_info[4]}
    prev_total=$((prev_idle + ${cpu_info[1]} + ${cpu_info[2]} + ${cpu_info[3]} + ${cpu_info[5]} + ${cpu_info[6]} + ${cpu_info[7]} + ${cpu_info[8]}))

    # Sleep for a short duration to gather updated CPU statistics
    sleep 1

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
    echo "CPUUsage: ${cpu_usage_percentage}%"
}

# Function to calculate network upload and download speeds
calculate_network_speed() {
    # Network interface to monitor (change to your specific interface, e.g., eth0, wlan0)
    interface="wlp4s0"
    delay=1
    
    # Function to calculate the speed in kilobytes per second
    calculate_speed() {
        local old_rx="$1"
        local old_tx="$2"
        local new_rx=$(grep "$interface" /proc/net/dev | awk '{print $2}')
        local new_tx=$(grep "$interface" /proc/net/dev | awk '{print $10}')
        local rx_speed=$(( ((new_rx - old_rx) / 1024) / delay ))  # Convert to KB/s
        local tx_speed=$(( ((new_tx - old_tx) / 1024) / delay ))  # Convert to KB/s
        echo "UploadSpeed: $rx_speed KB/s"
        echo "DownloadSpeed: $tx_speed KB/s"
    }
    
    # Initial values
    initial_rx=$(grep "$interface" /proc/net/dev | awk '{print $2}')
    initial_tx=$(grep "$interface" /proc/net/dev | awk '{print $10}')
    
    # Wait for the specified delay
    sleep "$delay"
    
    # Calculate and display the speeds
    calculate_speed "$initial_rx" "$initial_tx"
}

# Function to get memory information
get_memory_info() {
    # Get total memory from /proc/meminfo
    total_memory_kb=$(grep -i "MemTotal" /proc/meminfo | awk '{print $2}')
    
    # Get free memory from /proc/meminfo
    free_memory_kb=$(grep -i "MemFree" /proc/meminfo | awk '{print $2}')
    
    # Convert memory values to gigabytes
    total_memory_gb=$(echo "scale=2; $total_memory_kb / 1024 / 1024" | bc)
    free_memory_gb=$(echo "scale=2; $free_memory_kb / 1024 / 1024" | bc)
    
    # Display the results
    echo "TotalMemory: ${total_memory_gb} GB"
    echo "FreeMemory: ${free_memory_gb} GB"
}

# Call the functions to monitor CPU usage, network speed, and memory
calculate_cpu_usage
calculate_network_speed
get_memory_info