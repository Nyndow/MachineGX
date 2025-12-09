# MachineGX

**MachineGX** is a powerful web-based platform built with **React** and **Flask** that allows you to **remotely control and manage your Linux machines** from anywhere.  
Designed for convenience and productivity, MachineGX helps you track system usage, monitor processes, execute commands, and manage your machine effortlessly through a clean modern UI.

![MachineGX1](https://github.com/user-attachments/assets/e53de379-e585-41bd-ac83-724cfb87a1c0)

---

## 🌍 What You Can Do With MachineGX

<img width="1250" height="537" alt="MachineGX3" src="https://github.com/user-attachments/assets/dc16345b-5f18-40c9-bef8-a7c522de95ce" />

<img width="1920" height="994" alt="MachineGX2" src="https://github.com/user-attachments/assets/648cd50c-b9ac-418c-a7a4-359adfda4e21" />

With this application, you can easily manage and control your computers from anywhere.  
MachineGX lets you:

- 📊 **Track and monitor resource usage** (CPU, RAM, Disk, Network)
- 🧩 **View and control running processes** in real time
- 🖥️ **Use a built-in terminal interface** to run commands remotely  
- ⚡ **Use instant shortcuts** for:
  - Power off / reboot  
  - Updating the system  
  - Transferring files  
  - Managing services  
- 💾 **Save frequently used commands** into your database and run them with one click
- 📂 **Upload and download files** easily

MachineGX brings multiple powerful tools together into one unified remote control dashboard.

---

## 🚀 Features

- ✔ Full remote command execution
- ✔ Computers information management
- ✔ Process and resource monitoring  
- ✔ File transfer (upload & download)
- ✔ Saved commands system execution
- ✔ Power actions  
- ✔ Modern real-time dashboard   
- ✔ Secure API with token authentication
- ✔ User management
  
---

##  🧩 Requirements
- The target machines must have a ssh server inside it obviously for the application to be able to access them
- The host machine must have docker and docker-compose installed (https://docs.docker.com/get-started/get-docker/ https://docs.docker.com/compose/install/ )


## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/nyndow/MachineGX.git
cd MachineGX
```
### 2. Run the application
```bash
docker-compose up
```

