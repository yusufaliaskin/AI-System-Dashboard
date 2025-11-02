let pingInterval;
let metricsInterval;
let currentPath = "C:\\Users\\Administrator";
let scanResults = [];
let totalScanned = 0;
let activeCount = 0;
let inactiveCount = 0;

// Tab Değiştirme Fonksiyonu
function switchTab(tabName) {
    // Tüm tab butonlarını pasif yap
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Tüm tab içeriklerini gizle
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Aktif tab'i seç
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    const activeContent = document.getElementById(`${tabName}Panel`);
    if (activeContent) activeContent.classList.add('active');
    
    // Bağlantı tipini güncelle
    updateConnectionType(tabName);
}

function updateConnectionType(type) {
    const typeMap = {
        'ssh': 'SSH Terminal',
        'rdp': 'RDP Masaüstü',
        'network': 'Ağ Taraması',
        'metrics': 'Sistem İzleme'
    };
    document.getElementById('connectionType').textContent = typeMap[type] || '-';
}

// Bağlantı Test Fonksiyonu

async function connectSystem() {
    const ipAddress = document.getElementById('ipAddress').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!ipAddress || !username || !password) {
        showNotification('Lütfen tüm bağlantı bilgilerini girin', 'error');
        return;
    }

    // Bağlantı durumunu güncelle
    updateConnectionStatus('connecting', 'Bağlanıyor...');

    // RDP bilgilerini güncelle
    document.getElementById('rdpIp').value = ipAddress;
    document.getElementById('rdpUsername').value = username;
    document.getElementById('rdpPassword').value = password;

    // Sistem metriklerini yükle
    clearInterval(pingInterval);
    clearInterval(metricsInterval);

    try {
        const response = await fetch(`http://localhost:5000/ping/${ipAddress}`);
        if (response.ok) {
            updateConnectionStatus('connected', 'Bağlantı Başarılı');
            updateLastConnection();
            loadMetrics();
            metricsInterval = setInterval(loadMetrics, 2000);
            pingInterval = setInterval(() => checkConnection(ipAddress), 5000);
            showNotification('Bağlantı başarıyla kuruldu!', 'success');
        } else {
            throw new Error('Bağlantı başarısız');
        }
    } catch (error) {
        console.error('Bağlantı hatası:', error);
        updateConnectionStatus('error', 'Bağlantı Başarısız');
        showNotification('Bağlantı başarısız!', 'error');
    }
}

function updateConnectionStatus(status, message) {
    const statusDiv = document.getElementById('connectionStatus');
    const indicator = statusDiv.querySelector('.status-indicator');
    const text = statusDiv.querySelector('span');
    
    indicator.className = 'status-indicator';
    
    if (status === 'connected') {
        indicator.classList.add('status-connected');
    } else if (status === 'error') {
        indicator.classList.add('status-error');
    } else {
        indicator.classList.add('status-disconnected');
    }
    
    text.textContent = message;
}

function updateLastConnection() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('tr-TR');
    document.getElementById('lastConnection').textContent = timeStr;
}

async function checkConnection(ipAddress) {
    try {
        const startTime = Date.now();
        const response = await fetch(`http://localhost:5000/ping/${ipAddress}`);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        document.getElementById('responseTime').textContent = `${responseTime}ms`;
        
        if (!response.ok) {
            updateConnectionStatus('error', 'Bağlantı Kaybı');
        }
    } catch (error) {
        updateConnectionStatus('error', 'Bağlantı Kaybı');
    }
}

function showNotification(message, type = 'info') {
    // Basit bildirim sistemi
    alert(message);
}

// Metrikler Yükleme
async function loadMetrics() {
    const ip = document.getElementById('ipAddress').value;
    if (!ip) return;
    
    try {
        const response = await fetch(`http://localhost:5000/remote-metrics/${ip}`);
        const data = await response.json();
        
        if (response.ok) {
            updateMetricsDisplay(data);
        }
    } catch (error) {
        console.error('Metrik yükleme hatası:', error);
    }
}

function updateMetricsDisplay(data) {
    // RAM
    document.getElementById('remoteRamValue').textContent = `${data.ram.percent.toFixed(1)}%`;
    document.getElementById('remoteRamDetails').textContent = 
        `${formatBytes(data.ram.used)} / ${formatBytes(data.ram.total)}`;
    document.getElementById('remoteRamBar').style.width = `${data.ram.percent}%`;

    // CPU
    document.getElementById('remoteCpuValue').textContent = `${data.cpu.percent.toFixed(1)}%`;
    document.getElementById('remoteCpuDetails').textContent = `${data.cpu.cores} çekirdek`;
    document.getElementById('remoteCpuBar').style.width = `${data.cpu.percent}%`;

    // Disk
    document.getElementById('remoteDiskValue').textContent = `${data.disk.percent.toFixed(1)}%`;
    document.getElementById('remoteDiskDetails').textContent = 
        `${formatBytes(data.disk.used)} / ${formatBytes(data.disk.total)}`;
    document.getElementById('remoteDiskBar').style.width = `${data.disk.percent}%`;
}

function refreshMetrics() {
    loadMetrics();
    showNotification('Metrikler yenilendi', 'success');
}

async function sendSSHCommand() {
    const ip = document.getElementById('ipAddress').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const command = document.getElementById('sshCommand').value.trim();
    const isSudo = document.getElementById('sudoCommand').checked;

    if (!ip || !username || !password) {
        showNotification('Lütfen önce bağlantı bilgilerini girin', 'error');
        return;
    }

    if (!command) {
        showNotification('Lütfen bir komut girin', 'error');
        return;
    }

    // Komutu terminale ekle
    appendToTerminal(`${username}@${ip}:~$ ${isSudo ? 'sudo ' : ''}${command}`, 'command-text');

    try {
        const response = await fetch('http://localhost:5000/api/ssh-connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ip: ip,
                username: username,
                password: password,
                command: command,
                is_sudo: isSudo
            })
        });

        const data = await response.json();
        
        if (data.error) {
            appendToTerminal(`Hata: ${data.error}`, 'error-text');
        } else {
            appendToTerminal(data.output || 'Komut başarıyla çalıştırıldı', 'success-text');
        }

    } catch (error) {
        console.error('SSH hatası:', error);
        appendToTerminal(`Hata: ${error.message}`, 'error-text');
    }

    // Input alnını temizle
    document.getElementById('sshCommand').value = '';
}

function appendToTerminal(text, className) {
    const terminal = document.getElementById('terminalOutput');
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    terminal.appendChild(line);
    
    // Otomatik scroll
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
    const terminal = document.getElementById('terminalOutput');
    terminal.innerHTML = `
        <div class="terminal-welcome">
            <pre>╔═══════════════════════════════════════════════════════╗
║         SSH Terminal - Uzak Sistem Yönetimi         ║
╚═══════════════════════════════════════════════════════╝</pre>
            <p>Terminal temizlendi. Yeni komutlar girin.</p>
        </div>
    `;
}

function copyTerminalOutput() {
    const terminal = document.getElementById('terminalOutput');
    const text = terminal.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Terminal çıktısı kopyalandı', 'success');
    }).catch(err => {
        console.error('Kopyalama hatası:', err);
    });
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 GB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function startNetworkScan() {
    const ipAddress = (document.getElementById('scanIpAddress') || document.getElementById('ipAddress')).value;
    
    if (!ipAddress) {
        showNotification('Lütfen bir IP adresi girin', 'error');
        return;
    }

    const statusDiv = document.getElementById('currentStatus');
    const resultsTable = document.getElementById('scanResults');
    const progressContainer = document.getElementById('progressContainer');
    
    // Sıfırla
    resultsTable.innerHTML = '';
    scanResults = [];
    totalScanned = 0;
    activeCount = 0;
    inactiveCount = 0;
    updateScanSummary();
    
    if (progressContainer) {
        progressContainer.style.display = 'flex';
    }

    try {
        const ws = new WebSocket('ws://localhost:5000/ws/scan');
        
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            
            if (data.type === 'status') {
                statusDiv.textContent = data.message;
                
                if (data.ip) {
                    totalScanned++;
                    
                    if (data.status === 'Aktif') {
                        activeCount++;
                    } else if (data.status === 'Pasif') {
                        inactiveCount++;
                    }
                    
                    updateScanSummary();
                    addScanResult(data);
                    
                    // Progress güncelle (254 IP için varsayım)
                    const progress = Math.min((totalScanned / 254) * 100, 100);
                    updateProgress(progress);
                }
                
                if (data.message.includes('tamamlandı')) {
                    if (progressContainer) {
                        progressContainer.style.display = 'none';
                    }
                }
            }
        };

        ws.onopen = function() {
            statusDiv.textContent = 'Tarama başlatılıyor...';
            ws.send(JSON.stringify({
                ipAddress: ipAddress
            }));
        };

        ws.onerror = function(error) {
            throw new Error('WebSocket bağlantı hatası');
        };

        ws.onclose = function() {
            statusDiv.textContent = 'Tarama tamamlandı';
        };

    } catch (error) {
        console.error('Tarama hatası:', error);
        statusDiv.innerHTML = `<span style="color: red;">Hata: ${error.message}</span>`;
    }
}

function addScanResult(data) {
    const resultsTable = document.getElementById('scanResults');
    
    // "Henüz tarama yapılmadı" satırını kaldır
    const noResults = resultsTable.querySelector('.no-results');
    if (noResults) {
        noResults.remove();
    }
    
    let ipRow = document.getElementById(`ip-${data.ip}`);
    
    if (!ipRow) {
        ipRow = document.createElement('tr');
        ipRow.id = `ip-${data.ip}`;
        resultsTable.appendChild(ipRow);
        scanResults.push(data);
    }

    const responseTime = data.time ? parseInt(data.time) : 0;
    const barWidth = Math.min((responseTime / 1000) * 100, 100);
    const statusClass = data.status === 'Aktif' ? 'active-host' : 'inactive-host';

    ipRow.innerHTML = `
        <td><strong>${data.ip}</strong></td>
        <td class="${statusClass}">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${data.status === 'Aktif' ? '#27ae60' : '#e74c3c'}; margin-right: 8px;"></span>
            ${data.status}
        </td>
        <td>${data.time || '-'}</td>
        <td>
            <div class="usage-bar">
                <div class="usage-fill" style="width: ${data.status === 'Aktif' ? barWidth : 0}%"></div>
            </div>
        </td>
        <td>
            ${data.status === 'Aktif' ? `
                <button onclick="quickConnect('${data.ip}')" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">Bağlan</button>
            ` : '-'}
        </td>
    `;
}

function updateScanSummary() {
    document.getElementById('totalHosts').textContent = totalScanned;
    document.getElementById('activeHosts').textContent = activeCount;
    document.getElementById('inactiveHosts').textContent = inactiveCount;
}

function updateProgress(percent) {
    const progressBar = document.getElementById('scanProgress');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }
    if (progressText) {
        progressText.textContent = `${Math.round(percent)}%`;
    }
}

function quickConnect(ip) {
    document.getElementById('ipAddress').value = ip;
    showNotification(`IP adresi ${ip} olarak ayarlandı`, 'success');
    switchTab('ssh');
}

function exportScanResults() {
    if (scanResults.length === 0) {
        showNotification('Dışa aktarılacak sonuç yok', 'error');
        return;
    }
    
    let csv = 'IP Adresi,Durum,Yanıt Süresi\n';
    scanResults.forEach(result => {
        csv += `${result.ip},${result.status},${result.time || '-'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network_scan_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Sonuçlar dışa aktarıldı', 'success');
}

// RDP Fonksiyonları
async function startRDP() {
    const ip = document.getElementById('ipAddress').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!ip || !username || !password) {
        showNotification('Lütfen tüm bağlantı bilgilerini doldurun', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/rdp-connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ip: ip,
                username: username,
                password: password
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        showNotification('RDP bağlantısı başlatılıyor...', 'success');

    } catch (error) {
        console.error('RDP hatası:', error);
        showNotification('RDP bağlantısı başlatılamadı: ' + error.message, 'error');
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Kopyalandı!', 'success');
    }).catch(err => {
        console.error('Kopyalama hatası:', err);
    });
}

function togglePasswordVisibility(elementId) {
    const element = document.getElementById(elementId);
    if (element.type === 'password') {
        element.type = 'text';
    } else {
        element.type = 'password';
    }
}