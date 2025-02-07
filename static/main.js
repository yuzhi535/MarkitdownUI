document.addEventListener('DOMContentLoaded', function() {
    // 添加后端API基础URL配置
    const API_BASE_URL = 'http://localhost:8000';

    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const preview = document.getElementById('preview');
    const dropZone = document.getElementById('dropZone');
    const formatBtn = document.getElementById('formatBtn');
    const saveBtn = document.getElementById('saveBtn');
    const saveDialog = document.getElementById('saveDialog');
    const filenameInput = document.getElementById('filename');
    const cancelSaveBtn = document.getElementById('cancelSave');
    const confirmSaveBtn = document.getElementById('confirmSave');
    const progress = document.getElementById('progress');
    const actionButtons = document.getElementById('actionButtons');

    // 确保 actionButtons 元素存在
    if (actionButtons) {
        // 初始化时隐藏操作按钮区域
        actionButtons.style.display = 'none';
    } else {
        console.error('找不到 actionButtons 元素');
    }

    // 阻止默认拖放行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // 添加拖放区域的视觉反馈
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('drag-active');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-active');
    }

    // 处理文件拖放
    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file && handleFile(file)) {
            fileInput.files = dt.files;
        }
    }

    function handleFile(file) {
        // 检查文件类型
        const allowedTypes = [
            '.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx',
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.mp3', '.wav', '.m4a', '.ogg',
            '.html', '.htm', '.csv', '.json', '.xml', '.zip'
        ];
        const fileExtension = file.name.toLowerCase().substr(file.name.lastIndexOf('.'));
        
        if (!allowedTypes.includes(fileExtension)) {
            alert('不支持的文件格式！请上传以下格式的文件：pdf, ppt, pptx, doc, docx, xls, xlsx, jpg, jpeg, png, gif, bmp, mp3, wav, m4a, ogg, html, htm, csv, json, xml, zip');
            return false;
        }

        // 显示文件名
        const fileName = document.createElement('p');
        fileName.textContent = `已选择: ${file.name}`;
        fileName.className = 'text-sm text-gray-600 text-center mt-2';
        
        const existingFileName = dropZone.querySelector('.text-gray-600');
        if (existingFileName) {
            existingFileName.remove();
        }
        dropZone.appendChild(fileName);

        // 设置默认保存文件名
        const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
        filenameInput.value = `${baseName}.md`;
        
        return true;
    }

    // 监听文件输入变化
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && !handleFile(file)) {
            // 如果文件处理失败，清空文件输入
            fileInput.value = '';
        }
    });

    // 格式化Markdown
    function formatMarkdown(markdown) {
        // 基本的格式化规则
        return markdown
            // 确保标题前后有空行
            // 确保列表项前后有空行
            .replace(/\n([*-]\s.*)/g, '\n\n$1')
            // 删除多余的空行
            .replace(/\n{3,}/g, '\n\n')
            // 确保代码块前后有空行
            .replace(/\n(```[\s\S]*?```)/g, '\n\n$1\n\n')
            .trim();
    }
    
    // 格式化按钮点击事件
    formatBtn.addEventListener('click', () => {
        const preElement = preview.querySelector('pre');
        if (preElement && preElement.textContent) {
            const formatted = formatMarkdown(preElement.textContent);
            preElement.textContent = formatted;
        }
    });

    // 保存按钮点击事件
    saveBtn.addEventListener('click', () => {
        const preElement = preview.querySelector('pre');
        if (!preElement || !preElement.textContent) {
            alert('没有可保存的内容');
            return;
        }
        
        // 显示保存对话框
        saveDialog.classList.remove('hidden');
    });

    // 取消保存
    cancelSaveBtn.addEventListener('click', () => {
        saveDialog.classList.add('hidden');
    });

    // 确认保存
    confirmSaveBtn.addEventListener('click', () => {
        const preElement = preview.querySelector('pre');
        if (!preElement || !preElement.textContent) {
            alert('没有可保存的内容');
            return;
        }
        
        const filename = filenameInput.value.trim() || 'converted.md';
        
        const blob = new Blob([preElement.textContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.endsWith('.md') ? filename : `${filename}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        saveDialog.classList.add('hidden');
    });

    // 显示进度条
    function showProgress() {
        progress.style.transform = 'scaleX(0)';
        progress.style.display = 'block';
        setTimeout(() => {
            progress.style.transform = 'scaleX(0.3)';
        }, 100);
    }

    // 更新进度条
    function updateProgress() {
        progress.style.transform = 'scaleX(0.6)';
    }

    // 完成进度条
    function completeProgress() {
        progress.style.transform = 'scaleX(1)';
        setTimeout(() => {
            progress.style.display = 'none';
        }, 300);
    }

    // 修改转换按钮的事件处理
    convertBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('请先选择文件');
            return;
        }

        // 再次验证文件类型
        if (!handleFile(file)) {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            showProgress();
            convertBtn.disabled = true;
            convertBtn.textContent = '转换中...';
            preview.innerHTML = '<p class="text-gray-500">正在转换，请稍候...</p>';

            // 获取API密钥
            const apiKey = localStorage.getItem('geminiApiKey');
            if (!apiKey) {
                throw new Error('请先设置API密钥');
            }

            const response = await fetch(`${API_BASE_URL}/convert`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-API-KEY': apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`服务器错误 (${response.status})`);
            }

            const responseText = await response.text();
            let result;

            try {
                result = JSON.parse(responseText);
            } catch (error) {
                // 如果响应是纯文本，直接作为 Markdown 处理
                result = {
                    success: true,
                    markdown: responseText
                };
            }

            // 添加格式化处理
            const formattedMarkdown = formatMarkdown(result.markdown || '');
            preview.innerHTML = `<pre class="whitespace-pre-wrap">${formattedMarkdown}</pre>`;
            
            if (actionButtons) {
                actionButtons.style.display = 'flex';
            }
            updateProgress();
            completeProgress();

        } catch (error) {
            progress.style.display = 'none';
            console.error('转换错误:', error);
            // 如果预览区域已经显示了内容，就不显示错误信息
            if (!preview.querySelector('pre')) {
                preview.innerHTML = `<p class="text-red-500">转换失败: ${error.message}</p>`;
                if (actionButtons) {
                    actionButtons.style.display = 'none';
                }
            }
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = '转换';
        }
    });
});
