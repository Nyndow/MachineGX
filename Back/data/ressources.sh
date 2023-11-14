#!/bin/bash
#calculate_cpu_usage() {
 #   cpu_info=($(grep '^cpu ' /proc/stat))
  #  prev_idle=${cpu_info[4]}
   # prev_total=$((prev_idle + ${cpu_info[1]} + ${cpu_info[2]} + ${cpu_info[3]} + ${cpu_info[5]} + ${cpu_info[6]} + ${cpu_info[7]} + ${cpu_info[8]}))

    #sleep 1

    #cpu_info=($(grep '^cpu ' /proc/stat))
    #idle=${cpu_info[4]}
    #total=$((idle + ${cpu_info[1]} + ${cpu_info[2]} + ${cpu_info[3]} + ${cpu_info[5]} + ${cpu_info[6]} + ${cpu_info[7]} + ${cpu_info[8]}))

#    idle_diff=$((idle - prev_idle))
 #   total_diff=$((total - prev_total))

  #  cpu_usage_percentage=$((100 * (total_diff - idle_diff) / total_diff))

    #echo "CPUUsage: ${cpu_usage_percentage}%"
#

calculate_network_speed() {
    interface="wlp5s0f3u2"
    delay=1
    
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
    
    initial_rx=$(grep "$interface" /proc/net/dev | awk '{print $2}')
    initial_tx=$(grep "$interface" /proc/net/dev | awk '{print $10}')
    
    sleep "$delay"
    
    calculate_speed "$initial_rx" "$initial_tx"
}

calculate_network_speed
