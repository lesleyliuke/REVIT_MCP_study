---
name: scale-drafting-width
description: "DraftingView 表格寬度縮放：僅縮放 X 軸（寬度不變高度），以左邊緣為錨點，將 DetailCurve 和 TextNote 的 X 座標按比例縮放。適用於 Excel 匯入後微調表格欄寬、統一多張表格的視覺比例。觸發條件：使用者提到縮放、scale、表格寬度、欄寬調整、縮小表格、放大表格、scale width、drafting view 寬度。工具：scale_drafting_view_width。"
---

# DraftingView 表格寬度縮放

僅縮放 X 軸（寬度），高度不變。以每個 view 的左邊緣為錨點。

## Available Tools

| 工具 | 用途 |
|------|------|
| `scale_drafting_view_width` | 縮放圖紙上 DraftingView 中表格的寬度 |

## Workflow

### Step 1：確認目標圖紙

確認使用者要縮放的圖紙。若未指定，工具預設使用當前作用圖紙。

### Step 2：執行縮放

```
scale_drafting_view_width({
  scaleFactor: 0.9,        // 0.9 = 縮小到 90%，1.1 = 放大到 110%
  sheetId: 目標圖紙ID,      // 選填，不指定則用當前圖紙
  viewNames: ["view1"]     // 選填，不指定則處理圖紙上所有 DraftingView
})
```

### Step 3：重新排列視埠

縮放後表格寬度改變，視埠之間的間距可能不對。提醒使用者是否需要重新排列：

```
arrange_viewports_on_sheet({
  viewNames: [...],
  direction: "horizontal",
  gapMm: -5,
  alignY: "top"
})
```

## Parameters

### `scale_drafting_view_width`

| 參數 | 說明 | 預設 |
|------|------|------|
| `scaleFactor` | 寬度縮放比例（0.9=縮小到90%，1.1=放大到110%） | `0.9` |
| `viewNames` | 只處理指定名稱的 DraftingView（選填） | 圖紙上所有 DraftingView |
| `sheetId` | 圖紙 Element ID（選填） | 當前作用圖紙 |

## 縮放機制

- **僅縮放 X 軸**，高度不變
- **錨點**：每個 view 的左邊緣（最小 X 座標）
- **同步縮放**：DetailCurve（表格線）和 TextNote（文字）的 X 座標
- **TextNote wrapping 寬度**也會等比縮放（`tn.Width *= scaleFactor`）
- 內部採**逐 View 獨立 Transaction**，大量 view（20+）不會卡死 Revit

## Notes

- 大量 view（20+）總耗時約 2 分鐘，MCP client 端可能 timeout，但 Revit 全程保持回應
- Timeout 不代表失敗，確認方式：`tail "$APPDATA/RevitMCP/Logs/RevitMCP_YYYYMMDD.log"`，看到 `[ScaleWidth] 完成` 即成功
- 可用 Ctrl+Z 逐 view 復原
- 縮放後通常需要搭配 `arrange_viewports_on_sheet` 重新排列視埠
