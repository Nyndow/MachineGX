class TopProcess:
    def __init__(self, pid, user, cpu, ram, command):
        self.pid = pid
        self.user = user
        self.cpu = cpu
        self.ram = ram
        self.command = command