export const seed = {
  "relicItem": [
    {
      "id": 1,
      "relic_code": "GY-2024-001",
      "name": "青花缠枝莲纹梅瓶",
      "era": "明代",
      "material": "瓷器",
      "collection_level": "一级",
      "storage_location": "陶瓷库房 A 区 12 架",
      "current_condition": "IN_RESTORATION"
    },
    {
      "id": 2,
      "relic_code": "QT-2024-014",
      "name": "彩绘陶武官俑",
      "era": "汉代",
      "material": "陶器",
      "collection_level": "二级",
      "storage_location": "陶器库房 B 区 03 架",
      "current_condition": "DAMAGED"
    },
    {
      "id": 3,
      "relic_code": "YQ-2023-088",
      "name": "银鎏金簪花钗",
      "era": "唐代",
      "material": "金银器",
      "collection_level": "二级",
      "storage_location": "金属库房 C 区 07 架",
      "current_condition": "FRAGILE"
    },
    {
      "id": 4,
      "relic_code": "SF-2025-002",
      "name": "绢本花鸟团扇面",
      "era": "宋代",
      "material": "丝织品",
      "collection_level": "一级",
      "storage_location": "书画库房恒温柜 05",
      "current_condition": "STABLE"
    }
  ],
  "damageRecord": [
    {
      "id": 1,
      "relic_id": 1,
      "damage_type": "釉面开裂",
      "position_desc": "腹部正面自口沿向下约 12cm 贯穿裂纹",
      "severity": "HIGH",
      "discovered_by": "周敏",
      "discovered_at": "2026-06-11T09:00:00Z",
      "image_url": "/mock/image_url-1.png",
      "status": "CONVERTED"
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_type": "彩绘层起甲",
      "position_desc": "左肩及背部彩绘层大面积起甲、粉化",
      "severity": "CRITICAL",
      "discovered_by": "李峥",
      "discovered_at": "2026-06-12T09:00:00Z",
      "image_url": "/mock/image_url-2.png",
      "status": "REGISTERED"
    },
    {
      "id": 3,
      "relic_id": 3,
      "damage_type": "金属点腐蚀",
      "position_desc": "钗头花瓣边缘点状锈蚀 5 处",
      "severity": "MEDIUM",
      "discovered_by": "陈朗",
      "discovered_at": "2026-06-13T09:00:00Z",
      "image_url": "/mock/image_url-3.png",
      "status": "REGISTERED"
    },
    {
      "id": 4,
      "relic_id": 4,
      "damage_type": "绢丝脆化",
      "position_desc": "扇面折痕处绢丝断裂、局部缺肉",
      "severity": "CRITICAL",
      "discovered_by": "周敏",
      "discovered_at": "2026-06-15T09:00:00Z",
      "image_url": "/mock/image_url-4.png",
      "status": "REGISTERED"
    }
  ],
  "restorationPlan": [
    {
      "id": 1,
      "relic_id": 1,
      "damage_record_id": 1,
      "plan_title": "梅瓶贯穿裂纹清洗与粘接修复方案",
      "method": "先以无水乙醇软化清理断面，使用 B72 树脂对位粘接，缝隙以矿物颜料作色补全。",
      "risk_assessment": "粘接对位偏差可能影响纹饰连贯，需分段固形。",
      "approval_status": "SUBMITTED",
      "owner_id": 1
    },
    {
      "id": 2,
      "relic_id": 4,
      "damage_record_id": 4,
      "plan_title": "团扇面折痕加固方案（草稿）",
      "method": "拟用轻薄丝绢托裱加固，具体黏合剂待定。",
      "risk_assessment": "待评估",
      "approval_status": "DRAFT",
      "owner_id": 1
    }
  ],
  "restorationStep": [
    {
      "id": 1,
      "plan_id": 1,
      "step_order": "1",
      "technique": "断面清理",
      "material_used": "无水乙醇、棉签",
      "operator_id": 1,
      "step_status": "SUBMITTED",
      "finished_at": ""
    }
  ],
  "imageVersion": [
    {
      "id": 1,
      "relic_id": 1,
      "plan_id": 1,
      "version_no": "v1",
      "image_type": "修复前",
      "file_path": "/mock/image_url-1.png",
      "capture_at": "2026-06-11T09:00:00Z",
      "note": "病害登记时拍摄"
    }
  ]
} as const;
