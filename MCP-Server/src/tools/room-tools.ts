/**
 * 房間/法規檢討工具 — architect, fire-safety Profile
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const roomTools: Tool[] = [
    {
        name: "get_room_info",
        description: "取得房間詳細資訊，包含中心點座標和邊界範圍。",
        inputSchema: {
            type: "object",
            properties: {
                roomId: { type: "number", description: "房間 Element ID（選填）" },
                roomName: { type: "string", description: "房間名稱（選填）" },
            },
        },
    },
    {
        name: "get_rooms_by_level",
        description: "取得指定樓層的所有房間清單，包含名稱、編號、面積、用途等。可用於容積檢討。",
        inputSchema: {
            type: "object",
            properties: {
                level: { type: "string", description: "樓層名稱（如：1F、Level 1）" },
                includeUnnamed: { type: "boolean", description: "是否包含未命名的房間", default: true },
            },
            required: ["level"],
        },
    },
    {
        name: "get_room_daylight_info",
        description: "取得房間的採光資訊，包含居室面積、外牆開口面積、採光比例。用於建築技術規則居室採光檢討。",
        inputSchema: {
            type: "object",
            properties: {
                level: { type: "string", description: "樓層名稱（選填）" },
            },
        },
    },
    {
        name: "check_exterior_wall_openings",
        description: "依據台灣建築技術規則第45條及第110條檢討外牆開口。自動讀取地界線計算距離，以顏色標示違規。",
        inputSchema: {
            type: "object",
            properties: {
                checkArticle45: { type: "boolean", description: "檢查第45條", default: true },
                checkArticle110: { type: "boolean", description: "檢查第110條", default: true },
                colorizeViolations: { type: "boolean", description: "以顏色標示", default: true },
                exportReport: { type: "boolean", description: "匯出 JSON 報表", default: false },
                reportPath: { type: "string", description: "報表輸出路徑" },
            },
        },
    },
    {
        name: "batch_set_room_height",
        description: "批次依房間名稱或用途分組，設定 Room 的 Upper Limit（ROOM_UPPER_LEVEL）與 Limit Offset（ROOM_UPPER_OFFSET）。不動樓層，只改 Room 參數。對 Model Group 內的 Room 會自動進入 EditGroup 模式（每個 GroupType 只編輯一次，變更同步到所有 instance），避免「modified outside group edit mode」警告。Transaction 內註冊 WarningSwallower 吞掉其他警告。單一 Transaction，可 Ctrl+Z 整批還原。",
        inputSchema: {
            type: "object",
            properties: {
                groups: {
                    type: "array",
                    description: "分組規則陣列。每個 group 指定一個房間名稱/用途關鍵字與目標高度(mm)。",
                    items: {
                        type: "object",
                        properties: {
                            nameMatch: {
                                type: "string",
                                description: "房間名稱/用途關鍵字（不區分大小寫，部分比對）。例：'居室'、'浴室'、'走廊'",
                            },
                            heightMm: {
                                type: "number",
                                description: "目標高度（mm，絕對值）。即 Upper Limit 對應樓層之上的 Limit Offset。範圍 1~10000。",
                            },
                            upperLevelName: {
                                type: "string",
                                description: "選填：指定 Upper Limit 要使用的樓層名稱。若留空則使用 Room 的 Base Level（房間高度 = Limit Offset = heightMm）。",
                            },
                        },
                        required: ["nameMatch", "heightMm"],
                    },
                },
                levelName: {
                    type: "string",
                    description: "選填：限制只修改某一樓層的 Room。留空則全專案。",
                },
                matchField: {
                    type: "string",
                    enum: ["name", "department"],
                    description: "比對欄位：'name' (ROOM_NAME) 或 'department' (ROOM_DEPARTMENT)。預設 'name'。",
                    default: "name",
                },
                summaryOnly: {
                    type: "boolean",
                    description: "true（預設）=只回計數與錯誤列表，避免 500+ Room 時 payload 爆炸；false=附帶每個 Room 的 OriginalValues 與 Modifications 明細（供 audit）。",
                    default: true,
                },
            },
            required: ["groups"],
        },
    },
];
