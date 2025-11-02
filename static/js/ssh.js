// ===================================
// Windows CMD Terminal - Full Admin Control
// Admin yetkisi ile tam bilgisayar kontrolü
// ===================================

let commandHistory = [];
let historyIndex = -1;
let currentPath = '';
let currentUser = null;

// Admin yetki kontrolü - Sayfa yüklenmeden önce
(function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert('⚠️ UYARI: Bu sayfaya erişim için ADMIN yetkisi gereklidir!');
        window.location.href = '/html/app.html';
    }
})();

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async function() {
    // Admin kontrolü
    if (!currentUser || currentUser.role !== 'admin') {
        return;
    }

    // Başlangıç mesajları
    addToTerminal('═══════════════════════════════════════════════════════════', 'output');
    addToTerminal('  ⚡ Windows CMD Terminal - Full Administrator Access', 'output');
    addToTerminal('  👤 Kullanıcı: ' + currentUser.username + ' (Administrator)', 'output');
    addToTerminal('═══════════════════════════════════════════════════════════', 'output');
    addToTerminal('');
    addToTerminal('✅ Terminal başlatıldı. TÜM Windows CMD komutlarını kullanabilirsiniz.', 'output');
    addToTerminal('📌 Örnek komutlar: dir, cd C:\\, ipconfig, systeminfo, tasklist, netstat', 'output');
    addToTerminal('📌 Dosya işlemleri: type dosya.txt, copy, move, del, mkdir, rmdir', 'output');
    addToTerminal('📌 Sistem komutları: whoami, net user, taskkill, shutdown, powershell', 'output');
    addToTerminal('');

    // Mevcut dizini al
    await getCurrentPath();

    // Terminal'i başlat
    initTerminal();

    // Input'a odaklan
    document.getElementById('commandInput').focus();
});

// Mevcut dizin yolunu al
async function getCurrentPath() {
    try {
        const response = await fetch('http://localhost:5000/get-current-path');
        const data = await response.json();
        if (data.path) {
            currentPath = data.path.trim();
            updatePrompt();
        } else {
            // Fallback
            currentPath = 'C:\\';
            updatePrompt();
        }
    } catch (error) {
        console.error('❌ Dizin yolu alınamadı:', error);
        currentPath = 'C:\\';
        updatePrompt();
    }
}

// Prompt güncelleme
function updatePrompt() {
    const promptSpan = document.querySelector('.prompt');
    if (promptSpan) {
        promptSpan.textContent = `${currentPath}>`;
    }
}

// Terminal başlatma
function initTerminal() {
    const terminal = document.getElementById('terminal');
    const commandInput = document.getElementById('commandInput');

    if (!commandInput) {
        console.error('❌ Command input bulunamadı!');
        return;
    }

    commandInput.addEventListener('keydown', async function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.value.trim();
            
            if (command) {
                // Komutu göster
                addToTerminal(`${currentPath}> ${command}`, 'output');
                
                // Komutu çalıştır (FULL ADMIN ACCESS)
                await executeCommandWithFullAccess(command);
                
                // Komut geçmişine ekle
                if (commandHistory[commandHistory.length - 1] !== command) {
                    commandHistory.push(command);
                }
                historyIndex = commandHistory.length;
                
                // Input'u temizle
                this.value = '';
            }
        } 
        else if (e.key === 'ArrowUp') {
            // Komut geçmişinde yukarı git
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                this.value = commandHistory[historyIndex];
            }
        } 
        else if (e.key === 'ArrowDown') {
            // Komut geçmişinde aşağı git
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                this.value = '';
            }
        }
        else if (e.key === 'Tab') {
            // Tab - otomatik tamamlama (ileride eklenebilir)
            e.preventDefault();
        }
        else if (e.ctrlKey && e.key === 'c') {
            // Ctrl+C - komutu iptal et
            e.preventDefault();
            this.value = '';
            addToTerminal('^C', 'error');
        }
        else if (e.ctrlKey && e.key === 'l') {
            // Ctrl+L - ekranı temizle
            e.preventDefault();
            clearTerminal();
        }
    });
}

// FULL ADMIN ACCESS - Komut çalıştırma
async function executeCommandWithFullAccess(command) {
    try {
        // API'ye istek gönder (server.py'deki /api/execute-cmd endpoint'i)
        const response = await fetch('http://localhost:5000/api/execute-cmd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.stringify(currentUser)
            },
            body: JSON.stringify({ 
                command: command,
                path: currentPath 
            })
        });
        
        const data = await response.json();
        
        // Hata kontrolü
        if (data.error) {
            addToTerminal(data.error, 'error');
        }
        
        // Çıktı varsa göster
        if (data.output) {
            addToTerminal(data.output, 'output');
        }
        
        // Yeni path varsa güncelle (cd komutları için)
        if (data.newPath) {
            currentPath = data.newPath.trim();
            updatePrompt();
        }
        
        // Başarılı komut mesajı (output yoksa)
        if (!data.error && !data.output) {
            addToTerminal('✅ Komut başarıyla çalıştırıldı.', 'output');
        }
        
    } catch (error) {
        addToTerminal('❌ Bağlantı hatası: ' + error.message, 'error');
        console.error('Komut çalıştırma hatası:', error);
    }
}

// Terminal'e metin ekleme
function addToTerminal(text, className = 'output') {
    const terminal = document.getElementById('terminal');
    if (!terminal) return;
    
    // Satırlara böl ve her satırı ekle
    const lines = text.split('\n');
    lines.forEach(line => {
        const div = document.createElement('div');
        div.textContent = line;
        div.className = className;
        terminal.appendChild(div);
    });
    
    // Scroll en alta
    terminal.scrollTop = terminal.scrollHeight;
}

// Terminal'i temizle
function clearTerminal() {
    const terminal = document.getElementById('terminal');
    if (terminal) {
        terminal.innerHTML = '';
        addToTerminal('Terminal temizlendi.', 'output');
    }
}

// Çıkış fonksiyonu (HTML'deki logout butonu için)
function logout() {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '/html/login.html';
    }
}