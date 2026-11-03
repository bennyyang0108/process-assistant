# 製程助手 V2

這是手機版的製程紀錄 App，和 V1（`製程助手v1.py`）用同一種 JSON 格式，兩邊可以互相匯入匯出。

## 兩種用法

| | A. claude.ai 連結版 | B. 自己架的離線版（這個資料夾） |
|---|---|---|
| 打開方式 | 用手機或電腦開 Claude 給你的連結 | 放上 GitHub Pages，開 `https://你的帳號.github.io/製程助手V2/` |
| 資料存在哪 | 雲端，手機和電腦同步 | 只存在那支手機的瀏覽器裡 |
| 沒網路 | 不能用 | 可以用（Service Worker 快取） |
| Claude 能讀資料 | 可以，直接請它分析 | 要先匯出 JSON/CSV |
| 已匯入 V1 資料 | 已匯入（19 個 Recipe、RG moscap 模板與 run） | 第一次打開後到「資料」→ 匯入 `V1資料_匯入用.json` |

建議先用 A 版跑一兩週，確認流程順手。如果無塵室附近收不到網路，再架 B 版。

## 現場流程

1. **今日**：按「新增今天的 run」，可以從「RG moscap」模板開始，並填一句「這批要回答的問題」。
2. 點開目前的步驟：
   - 開始計時（時間依 Recipe 的預估分鐘數；計時中螢幕不會自動關閉）
   - 照 SOP 一項一項打勾（會記下時間）
   - 填實際參數。按「全部同計畫」後只改不同的值。
   - 紀錄或標記異常
3. 按「完成這一步」時寫一句**學到了什麼或踩到什麼雷**。這句話會寫回 Recipe，下次跑到同一步會先跳出提醒。
4. **快記**：出無塵室時用鍵盤的麥克風講一句話，會自動抓出機台、材料和數值。可以選擇掛在某個 run 上。
5. **Recipe**：整理 SOP，一行就是一個步驟。目前 19 個 Recipe 幾乎都還沒有 SOP，這是接下來最值得補的地方。

## 匯出

- **單一 run（V1 格式）**：在 run 頁按 ⋯ → 匯出。V1 可以直接讀。
- **分析用 CSV**：每個參數一列，欄位包含 run、日期、晶片、步驟、計畫值、實際值、開始/完成時間、異常。可以直接用 pandas 或 Excel 讀。
- **完整備份 JSON**：包含 Recipe、run、模板、快記。用來在 A、B 兩版之間搬資料。

## 部署 B 版到 GitHub Pages

1. 到 github.com 建立 repo，例如 `process-assistant`。注意要用英文名稱，網址比較好打。
2. 用 Add file → Upload files 上傳這個資料夾裡的全部檔案：`index.html`、`manifest.json`、`sw.js`、`icons/`。
   - 不要上傳 `V1資料_匯入用.json`：public repo 誰都看得到。這個檔案直接在手機上匯入就好。
3. 到 Settings → Pages，Branch 選 `main`、`/(root)`，按 Save。
4. 1–2 分鐘後，用手機打開 `https://你的帳號.github.io/process-assistant/`，然後加到主畫面：
   - iPhone：Safari → 分享 → 加入主畫面
   - Android：Chrome → ⋮ → 安裝應用程式
5. 改版時要把 `sw.js` 裡的 `VERSION` 改成新的名稱（例如 `pa2-v2`），手機才會換成新檔案。

## 檔案

```
index.html               App 本體（HTML + CSS + JavaScript，單一檔案）
manifest.json            PWA 名片：名稱、圖示、顏色
sw.js                    離線快取
icons/                   主畫面圖示
V1資料_匯入用.json        從 V1 轉出的 Recipe、模板和 run（不要放到 public repo）
```

## 資料格式

- run 和 step 的欄位沿用 V1（`planned_parameters`、`actual_parameters`、`sop_checks`、`started_at`、`completed_at`…）。
- V2 多了這些欄位，V1 讀取時會忽略，不影響使用：
  - step：`sop_check_times`、`anomaly`、`lesson`、`timer_start`
  - recipe：`lessons`
