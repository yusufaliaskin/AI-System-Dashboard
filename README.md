# 🖥️ AI System Dashboard

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-lightgrey.svg)

A comprehensive web-based system administration dashboard with remote management capabilities, network scanning, and real-time system monitoring.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

AI System Dashboard is a powerful, web-based system administration tool designed to provide comprehensive control over both local and remote systems. Built with Flask and modern web technologies, it offers real-time monitoring, SSH terminal access, RDP connections, network scanning, and web vulnerability assessment capabilities.

### Key Highlights

- **Real-time System Monitoring**: Track CPU, RAM, and disk usage with live updates
- **Remote System Management**: SSH and RDP connectivity for remote administration
- **Network Scanner**: Discover and analyze devices on your network
- **Web Security Scanner**: Identify potential vulnerabilities in web applications
- **User Management**: Role-based access control (Admin/User)
- **Cross-Platform**: Works on Windows and Linux systems

---

## ✨ Features

### 🔍 System Monitoring

- **Real-time Metrics Dashboard**
  - CPU usage percentage and core count
  - RAM utilization with detailed breakdowns
  - Disk space monitoring
  - Live process viewer with resource consumption
  - Sortable process table (by name, PID, memory, CPU)

### 🌐 Remote System Management

- **SSH Terminal**
  - Interactive command-line interface
  - Command history navigation (Arrow Up/Down)
  - Sudo command support
  - Real-time output streaming
  - Terminal output copy functionality

- **RDP (Remote Desktop Protocol)**
  - Windows Remote Desktop integration
  - Automated connection launching
  - Credential management
  - Cross-platform RDP support (xfreerdp for Linux)

### 🔎 Network Scanning

- **IP Range Scanner**
  - CIDR notation support (e.g., 192.168.1.0/24)
  - Single IP or subnet scanning
  - Ping-based host discovery
  - Response time measurement
  - Active/passive host classification
  - Export scan results
  - Real-time progress tracking

### 🕷️ Web Security Scanner

- **Comprehensive Web Analysis**
  - HTTP/HTTPS protocol support
  - Security header validation
    - Content-Security-Policy (CSP)
    - X-Frame-Options
    - X-Content-Type-Options
    - Referrer-Policy
    - Strict-Transport-Security (HSTS)
  - Admin panel discovery
  - robots.txt analysis
  - Technology fingerprinting
  - Open redirect vulnerability detection
  - SSL/TLS configuration check
  - HTTP response code analysis

### 👥 User Management

- **Role-Based Access Control**
  - Admin and User roles
  - Secure authentication
  - User CRUD operations (Create, Read, Update, Delete)
  - Password management
  - Session handling

---

## 🛠️ Technology Stack

### Backend

- **Python 3.8+**
- **Flask 2.0+** - Web framework
- **Flask-CORS** - Cross-Origin Resource Sharing
- **Flask-Sock** - WebSocket support
- **psutil** - System and process utilities
- **paramiko** - SSH protocol implementation
- **py-cpuinfo** - CPU information gathering
- **requests** - HTTP library

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript (ES6+)** - Interactive functionality
- **WebSocket** - Real-time communication

### System Integration

- **SQLite3** - User database (optional)
- **JSON** - User data storage
- **subprocess** - System command execution
- **Windows CMD / Linux Shell** - Terminal integration

---

## 📁 Project Structure

```
SohbetAI/
├── python/                      # Backend server code
│   ├── data/
│   │   └── users.json          # User credentials database
│   ├── server.py               # Main Flask application
│   ├── users.py                # User management module
│   ├── database.py             # Database initialization
│   ├── ssh_handler.py          # SSH command execution handler
│   └── users.json              # Backup user data
│
├── static/                      # Frontend assets
│   ├── html/                   # HTML pages
│   │   ├── login.html          # Login page
│   │   ├── app.html            # System monitor dashboard
│   │   ├── remote.html         # Remote system management
│   │   ├── ssh.html            # SSH terminal interface
│   │   ├── users.html          # User management panel
│   │   └── webscanner.html     # Web security scanner
│   │
│   ├── css/                    # Stylesheets
│   │   ├── style.css           # Global styles
│   │   ├── navbar.css          # Navigation bar styles
│   │   ├── app.css             # Dashboard styles
│   │   ├── remote.css          # Remote management styles
│   │   ├── users.css           # User management styles
│   │   ├── webscanner.css      # Scanner styles
│   │   └── aichat.css          # AI chat widget styles
│   │
│   └── js/                     # JavaScript files
│       ├── login.js            # Authentication logic
│       ├── system.js           # System monitoring
│       ├── remote.js           # Remote management
│       ├── ssh.js              # SSH terminal functionality
│       ├── users.js            # User management
│       ├── webscanner.js       # Web scanner logic
│       ├── navbar.js           # Navigation functionality
│       └── aichat.js           # AI chat integration
│
└── README.md                    # Project documentation
```

---

## 🚀 Installation

### Prerequisites

- **Python 3.8 or higher**
- **pip** (Python package installer)
- **Git** (optional, for cloning)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yusufaliaskin/AI-System-Dashboard.git
cd AI-System-Dashboard
```

### Step 2: Install Dependencies

```bash
pip install flask flask-cors flask-sock psutil paramiko py-cpuinfo requests
```

**Or create a requirements.txt:**

```bash
pip install -r requirements.txt
```

**requirements.txt contents:**
```
Flask>=2.0.0
flask-cors>=3.0.10
flask-sock>=0.5.0
psutil>=5.8.0
paramiko>=2.7.0
py-cpuinfo>=8.0.0
requests>=2.26.0
```

### Step 3: Initialize User Database

The default admin credentials are:
- **Username**: `admin`
- **Password**: `123`

**⚠️ IMPORTANT**: Change the default password immediately after first login!

### Step 4: Start the Server

```bash
cd python
python server.py
```

The server will start on `http://0.0.0.0:5000`

### Step 5: Access the Dashboard

Open your web browser and navigate to:
```
http://localhost:5000
```

---

## ⚙️ Configuration

### Port Configuration

To change the default port (5000), edit `server.py`:

```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=YOUR_PORT, debug=True)
```

### User Data Storage

User credentials are stored in:
- `python/data/users.json` (primary)
- `python/users.json` (backup)

**Format:**
```json
[
    {
        "username": "admin",
        "password": "123",
        "role": "admin"
    }
]
```

### Security Headers

CORS is enabled by default. To restrict access, modify `server.py`:

```python
CORS(app, resources={r"/*": {"origins": "http://yourdomain.com"}})
```

---

## 📖 Usage

### 1. Login

1. Navigate to `http://localhost:5000`
2. Enter credentials (default: admin/123)
3. Click "Giriş Yap" (Login)

### 2. System Monitor

**Access**: Main dashboard after login

- View real-time CPU, RAM, and disk usage
- Monitor running processes
- Sort processes by different metrics
- Toggle detailed process view

### 3. Remote System Management

**Access**: Navigate to "Uzak Sistem" (Remote System)

#### SSH Terminal:
1. Enter target IP address
2. Provide username and password
3. Click "Bağlantıyı Test Et" (Test Connection)
4. Switch to "SSH Terminal" tab
5. Enter commands in the terminal
6. Use checkbox for sudo commands

#### RDP Connection:
1. Switch to "RDP Masaüstü" tab
2. Credentials auto-populate from connection form
3. Click "RDP Bağlantısını Başlat" (Start RDP Connection)

### 4. Network Scanning

**Access**: Remote System → "Ağ Taraması" (Network Scan)

1. Enter IP range (e.g., `192.168.1.0/24`)
2. Click "Taramayı Başlat" (Start Scan)
3. Monitor progress in real-time
4. View active/passive hosts
5. Export results if needed

### 5. Web Security Scanner

**Access**: Navigate to "Web Tarayıcı" (Web Scanner)

1. Enter target URL (e.g., `https://example.com`)
2. Optional: Enable "Derin tarama" (Deep Scan)
3. Click "Taramayı Başlat" (Start Scan)
4. Review:
   - HTTP headers
   - Security checks
   - Admin panel candidates
   - robots.txt
   - Server summary

### 6. User Management (Admin Only)

**Access**: Navigate to "Kullanıcı Kontrolü" (User Control)

- **Add User**: Fill form and click "Kullanıcı Ekle"
- **Delete User**: Click "Sil" (Delete) next to username
- **Change Password**: Click "Şifre Değiştir" (Change Password)

---

## 🔌 API Documentation

### Authentication

#### POST `/login`
Authenticate user and create session.

**Request:**
```json
{
    "username": "admin",
    "password": "123"
}
```

**Response:**
```json
{
    "message": "Giriş başarılı",
    "username": "admin",
    "role": "admin"
}
```

### System Monitoring

#### GET `/system-info`
Retrieve current system metrics.

**Response:**
```json
{
    "ram": {
        "total": 16777216000,
        "used": 8388608000,
        "free": 8388608000,
        "percent": 50.0
    },
    "cpu": {
        "percent": 25.5,
        "cores": 8
    },
    "disk": {
        "total": 500107862016,
        "used": 250053931008,
        "free": 250053931008,
        "percent": 50.0
    }
}
```

#### GET `/processes`
Get list of running processes.

**Response:**
```json
[
    {
        "name": "chrome.exe",
        "pid": 1234,
        "memory": "256.5 MB",
        "memory_percent": 1.5,
        "cpu": "2.3%"
    }
]
```

### Command Execution

#### POST `/api/execute-cmd`
Execute system command with path support.

**Request:**
```json
{
    "command": "dir",
    "path": "C:\\Users"
}
```

**Response:**
```json
{
    "output": "...",
    "newPath": "C:\\Users"
}
```

### SSH Operations

#### POST `/api/ssh-connect`
Execute SSH command on remote system.

**Request:**
```json
{
    "ip": "192.168.1.100",
    "username": "user",
    "password": "password",
    "command": "ls -la",
    "is_sudo": false
}
```

**Response:**
```json
{
    "output": "total 48\ndrwxr-xr-x..."
}
```

### Remote Desktop

#### POST `/api/rdp-connect`
Initiate RDP connection.

**Request:**
```json
{
    "ip": "192.168.1.100",
    "username": "administrator",
    "password": "password"
}
```

**Response:**
```json
{
    "message": "RDP bağlantısı başlatıldı"
}
```

### Network Scanning

#### WebSocket `/ws/scan`
Real-time network scanning via WebSocket.

**Send:**
```json
{
    "ipAddress": "192.168.1.0/24"
}
```

**Receive (streaming):**
```json
{
    "type": "status",
    "ip": "192.168.1.1",
    "status": "Aktif",
    "time": "5 ms",
    "progress": 25.5,
    "message": "Aktif cihaz bulundu: 192.168.1.1"
}
```

### Web Scanner

#### POST `/api/webscan`
Perform web security scan.

**Request:**
```json
{
    "url": "https://example.com",
    "deep": false
}
```

**Response:**
```json
{
    "target": "https://example.com",
    "status": "ok",
    "http_code": 200,
    "ssl": true,
    "headers": {...},
    "security": [...],
    "admin_panels": [...],
    "robots": "...",
    "summary": {...}
}
```

### User Management

#### GET `/api/users`
Retrieve all users (passwords excluded).

#### POST `/api/users`
Create new user.

**Request:**
```json
{
    "username": "newuser",
    "password": "securepass",
    "role": "user"
}
```

#### DELETE `/api/users/<username>`
Delete specific user.

#### PUT `/api/users/<username>/password`
Change user password.

**Request:**
```json
{
    "newPassword": "newsecurepass"
}
```

---

## 🔒 Security

### Current Implementation

- Session-based authentication
- Role-based access control (RBAC)
- Command injection prevention (basic)
- CORS protection
- Dangerous command blocking in SSH handler

### Security Recommendations

**⚠️ CRITICAL - BEFORE PRODUCTION USE:**

1. **Password Hashing**
   ```python
   import hashlib
   password_hash = hashlib.sha256(password.encode()).hexdigest()
   ```

2. **HTTPS/SSL**
   - Use SSL certificates
   - Enable HTTPS on Flask

3. **Environment Variables**
   - Store sensitive data in `.env` files
   - Never commit credentials to version control

4. **Input Validation**
   - Sanitize all user inputs
   - Implement rate limiting

5. **Authentication Tokens**
   - Implement JWT or OAuth2
   - Add session expiration

6. **Database Security**
   - Use proper database instead of JSON files
   - Implement prepared statements

7. **Firewall Rules**
   - Restrict access to specific IP ranges
   - Use VPN for remote access

### Blocked Commands

The SSH handler blocks potentially dangerous commands:
- `rm -rf`
- `mkfs`
- `dd`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Comment complex logic
- Test thoroughly before submitting

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Flask framework and community
- psutil developers
- paramiko SSH library
- All open-source contributors
- Original inspiration: [System-Board](https://github.com/JosephSpace/System-Board)

---

## 📞 Contact

**Yusuf Ali Aşkın**
- GitHub: [@yusufaliaskin](https://github.com/yusufaliaskin)
- LinkedIn: [Yusuf Aşkın](https://www.linkedin.com/in/yusuf-aşkın-56015b232/)
- Instagram: [@joseph.ddf](https://www.instagram.com/joseph.ddf/)
- Email: yusufaliaskin@gmail.com
- Project Link: [https://github.com/yusufaliaskin/AI-System-Dashboard](https://github.com/yusufaliaskin/AI-System-Dashboard)

---

## 🐛 Known Issues

- RDP connections require manual terminal interaction on some systems
- Network scanning speed depends on ping timeout settings
- SQLite database initialization is optional and not fully integrated
- Two users.json files require synchronized updates

## 🗺️ Roadmap

- [ ] Add Docker support
- [ ] Implement proper JWT authentication
- [ ] Add database migration tools
- [ ] Create mobile-responsive design
- [ ] Add system logs viewer
- [ ] Implement file transfer capabilities
- [ ] Add multi-language support
- [ ] Create API rate limiting
- [ ] Add automated backup features
- [ ] Implement notification system
- [ ] Consolidate dual users.json files
- [ ] Add password strength requirements
- [ ] Implement two-factor authentication

---

<div align="center">

**⭐ Star this repository if you find it helpful! ⭐**

Made with ❤️ by [Yusuf Ali Aşkın](https://github.com/yusufaliaskin)

</div>
