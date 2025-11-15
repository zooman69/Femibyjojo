const fs = require('fs');

let content = fs.readFileSync('inventory-manager-wix.html', 'utf8');

// Find where the styles end
const styleStart = content.indexOf('<style>');
const styleEnd = content.indexOf('</style>') + '</style>'.length;

// Extract parts before and after styles
const beforeStyles = content.substring(0, styleStart);
const afterStyles = content.substring(styleEnd);

// Dark mode CSS
const darkModeCSS = `<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f0f0f;
            min-height: 100vh;
            padding: 20px;
            color: #e0e0e0;
        }

        .container {
            max-width: 1600px;
            margin: 0 auto;
            background: #1a1a1a;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            overflow: hidden;
            border: 1px solid #2a2a2a;
        }

        header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-bottom: 2px solid #00d9ff;
        }

        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #00d9ff, #00ffaa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .wix-status {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 20px;
            background: rgba(0, 217, 255, 0.1);
            border-radius: 20px;
            margin-top: 10px;
            cursor: pointer;
            border: 1px solid rgba(0, 217, 255, 0.3);
        }

        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #dc3545;
        }

        .status-dot.connected {
            background: #00ffaa;
            box-shadow: 0 0 15px #00ffaa;
        }

        .stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .stat-card {
            background: rgba(0, 217, 255, 0.1);
            padding: 15px 25px;
            border-radius: 10px;
            border: 1px solid rgba(0, 217, 255, 0.2);
        }

        .stat-card .number {
            font-size: 2em;
            font-weight: bold;
            color: #00d9ff;
        }

        .stat-card .label {
            font-size: 0.9em;
            opacity: 0.9;
            color: #a0a0a0;
        }

        .controls {
            padding: 30px;
            background: #1a1a1a;
            border-bottom: 1px solid #2a2a2a;
        }

        .control-row {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            flex-wrap: wrap;
            align-items: center;
        }

        .control-row:last-child {
            margin-bottom: 0;
        }

        button {
            padding: 12px 24px;
            border: 1px solid #00d9ff;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #00d9ff, #00ffaa);
            color: #0f0f0f;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0, 217, 255, 0.5);
        }

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        button.wix-sync {
            background: linear-gradient(135deg, #00d9ff, #00ffaa);
        }

        .search-box {
            flex: 1;
            min-width: 250px;
        }

        input[type="text"],
        input[type="file"],
        input[type="number"],
        select,
        textarea {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.3s ease;
            background: #252525;
            color: #e0e0e0;
        }

        input:focus,
        select:focus,
        textarea:focus {
            outline: none;
            border-color: #00d9ff;
            box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.2);
        }

        select {
            cursor: pointer;
            min-width: 150px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            position: sticky;
            top: 0;
            z-index: 10;
            border-bottom: 2px solid #00d9ff;
        }

        th {
            padding: 15px 10px;
            text-align: left;
            font-weight: 600;
            color: #00d9ff;
            cursor: pointer;
            white-space: nowrap;
        }

        th:hover {
            background: rgba(0, 217, 255, 0.1);
        }

        tbody tr {
            border-bottom: 1px solid #2a2a2a;
            transition: all 0.3s ease;
        }

        tbody tr:hover {
            background: rgba(0, 217, 255, 0.05);
        }

        tbody tr.syncing {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        td {
            padding: 15px 10px;
            color: #e0e0e0;
        }

        td input[type="checkbox"] {
            cursor: pointer;
            width: 18px;
            height: 18px;
        }

        .product-image {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.3s ease;
            border: 2px solid #2a2a2a;
        }

        .product-image:hover {
            transform: scale(2);
            z-index: 100;
            box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3);
        }

        .price {
            font-weight: 600;
            color: #00d9ff;
        }

        .visible-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .visible-badge.visible-true {
            background: rgba(0, 255, 170, 0.2);
            color: #00ffaa;
            border: 1px solid rgba(0, 255, 170, 0.3);
        }

        .visible-badge.visible-false {
            background: rgba(255, 107, 107, 0.2);
            color: #ff6b6b;
            border: 1px solid rgba(255, 107, 107, 0.3);
        }

        .sync-status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .sync-status.pending {
            background: rgba(160, 160, 160, 0.2);
            color: #a0a0a0;
            border: 1px solid rgba(160, 160, 160, 0.3);
        }

        .sync-status.syncing {
            background: rgba(0, 217, 255, 0.2);
            color: #00d9ff;
            border: 1px solid rgba(0, 217, 255, 0.3);
        }

        .sync-status.synced {
            background: rgba(0, 255, 170, 0.2);
            color: #00ffaa;
            border: 1px solid rgba(0, 255, 170, 0.3);
        }

        .sync-status.error {
            background: rgba(255, 107, 107, 0.2);
            color: #ff6b6b;
            border: 1px solid rgba(255, 107, 107, 0.3);
        }

        .edit-btn,
        .sync-btn,
        .delete-btn {
            padding: 6px 12px;
            margin-right: 5px;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .edit-btn {
            background: #00d9ff;
            color: #0f0f0f;
            border: 1px solid #00d9ff;
        }

        .edit-btn:hover {
            background: #00c4e6;
            box-shadow: 0 4px 15px rgba(0, 217, 255, 0.4);
        }

        .sync-btn {
            background: #00ffaa;
            color: #0f0f0f;
            border: 1px solid #00ffaa;
        }

        .sync-btn:hover {
            background: #00e699;
            box-shadow: 0 4px 15px rgba(0, 255, 170, 0.4);
        }

        .delete-btn {
            background: #ff6b6b;
            color: white;
            border: 1px solid #ff6b6b;
        }

        .delete-btn:hover {
            background: #ff5252;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }

        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            padding: 20px;
            background: #1a1a1a;
            border-top: 1px solid #2a2a2a;
        }

        .pagination button {
            padding: 8px 16px;
            background: #252525;
            border: 1px solid #2a2a2a;
            color: #e0e0e0;
        }

        .pagination button:hover:not(:disabled) {
            background: rgba(0, 217, 255, 0.2);
            border-color: #00d9ff;
        }

        .page-info {
            color: #a0a0a0;
            font-size: 14px;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 1000;
            backdrop-filter: blur(5px);
        }

        .modal.active {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: #1a1a1a;
            padding: 30px;
            border-radius: 16px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 217, 255, 0.3);
            border: 1px solid #2a2a2a;
        }

        .modal-content h2 {
            margin-bottom: 20px;
            color: #00d9ff;
            font-size: 1.8em;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #a0a0a0;
        }

        .modal-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 25px;
        }

        .close-modal {
            background: #2a2a2a;
            color: #e0e0e0;
            border: 1px solid #3a3a3a;
        }

        .close-modal:hover {
            background: #3a3a3a;
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 2000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .notification.success {
            background: linear-gradient(135deg, #00ffaa, #00d9ff);
            color: #0f0f0f;
        }

        .notification.error {
            background: linear-gradient(135deg, #ff6b6b, #ff5252);
        }

        .notification.info {
            background: linear-gradient(135deg, #00d9ff, #00c4e6);
            color: #0f0f0f;
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        #connectionLog {
            margin-top: 15px;
            padding: 15px;
            background: #252525;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            max-height: 200px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
            color: #a0a0a0;
        }

        .log-entry {
            margin-bottom: 5px;
            padding: 5px;
            border-left: 3px solid #00d9ff;
            padding-left: 10px;
        }

        .log-entry.error {
            border-left-color: #ff6b6b;
            color: #ff6b6b;
        }

        .log-entry.success {
            border-left-color: #00ffaa;
            color: #00ffaa;
        }
    </style>`;

// Combine parts
const newContent = beforeStyles + darkModeCSS + afterStyles;
fs.writeFileSync('inventory-manager-wix.html', newContent);
console.log('✅ Dark mode CSS applied successfully!');
