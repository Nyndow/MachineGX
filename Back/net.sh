#!/bin/bash

# Network interface to monitor (change to your specific interface, e.g., eth0, wlan0)
interface="wlp4s0"
delay=1
calculate_speed() {
    local old_rx="$1"
    local old_tx="$2"
    local new_rx=$(grep "$interface" /proc/net/dev | awk '{print $2}')
    local new_tx=$(grep "$interface" /proc/net/dev | awk '{print $10}')
    local rx_speed=$(( ((new_rx - old_rx) / 1024) / delay ))  # Convert to KB/s
    local tx_speed=$(( ((new_tx - old_tx) / 1024) / delay ))  # Convert to KB/s
    echo "Upload Speed: $rx_speed KB/s"
    echo "Download Speed: $tx_speed KB/s"
}

# Initial values
initial_rx=$(grep "$interface" /proc/net/dev | awk '{print $2}')
initial_tx=$(grep "$interface" /proc/net/dev | awk '{print $10}')

# Wait for the specified delay
sleep "$delay"

# Calculate and display the speeds
calculate_speed "$initial_rx" "$initial_tx"
