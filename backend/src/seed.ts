export const seed = {
  "relicItem": [
    {
      "id": 1,
      "relic_code": "WW-0001",
      "name": "青花缠枝莲纹梅瓶",
      "era": "明永乐",
      "material": "瓷",
      "collection_level": "一级",
      "storage_location": "一号库房 A-03",
      "current_condition": "STABLE"
    },
    {
      "id": 2,
      "relic_code": "WW-0002",
      "name": "鎏金铜佛像",
      "era": "唐",
      "material": "铜鎏金",
      "collection_level": "一级",
      "storage_location": "二号库房 B-11",
      "current_condition": "DAMAGED"
    },
    {
      "id": 3,
      "relic_code": "WW-0003",
      "name": "绢本山水立轴",
      "era": "清",
      "material": "绢本设色",
      "collection_level": "二级",
      "storage_location": "书画库房 C-02",
      "current_condition": "IN_RESTORATION"
    }
  ],
  "damageRecord": [
    {
      "id": 1,
      "relic_id": 1,
      "damage_type": "釉面开裂",
      "position_desc": "瓶身腹部 3cm 斜向裂纹",
      "severity": "CRITICAL",
      "discovered_by": "王修复",
      "discovered_at": "2026-09-10T09:00:00Z",
      "image_url": "/mock/damage-1.png",
      "status": "OPEN"
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_type": "鎏金层剥落",
      "position_desc": "背光右缘长约 8cm",
      "severity": "HIGH",
      "discovered_by": "李档案",
      "discovered_at": "2026-09-12T10:30:00Z",
      "image_url": "/mock/damage-2.png",
      "status": "OPEN"
    },
    {
      "id": 3,
      "relic_id": 3,
      "damage_type": "绢面霉斑",
      "position_desc": "画心左下角",
      "severity": "MEDIUM",
      "discovered_by": "王修复",
      "discovered_at": "2026-09-13T14:00:00Z",
      "image_url": "/mock/damage-3.png",
      "status": "OPEN"
    },
    {
      "id": 4,
      "relic_id": 2,
      "damage_type": "底座裂缝",
      "position_desc": "莲花底座正面",
      "severity": "LOW",
      "discovered_by": "赵巡检",
      "discovered_at": "2026-09-05T11:20:00Z",
      "image_url": "/mock/damage-4.png",
      "status": "CLOSED"
    },
    {
      "id": 5,
      "relic_id": 3,
      "damage_type": "轴头松动",
      "position_desc": "地轴轴头脱落",
      "severity": "HIGH",
      "discovered_by": "李档案",
      "discovered_at": "2026-09-01T09:40:00Z",
      "image_url": "/mock/damage-5.png",
      "status": "CONVERTED"
    },
    {
      "id": 6,
      "relic_id": 1,
      "damage_type": "瓶口磕伤",
      "position_desc": "瓶口沿约 2cm 缺釉",
      "severity": "HIGH",
      "discovered_by": "赵巡检",
      "discovered_at": "2026-09-15T16:10:00Z",
      "image_url": "/mock/damage-6.png",
      "status": "OPEN"
    }
  ],
  "restorationPlan": [
    {
      "id": 1,
      "relic_id": 3,
      "damage_record_id": 5,
      "plan_title": "立轴轴头加固修复方案",
      "method": "传统装裱工艺更换轴头，糨糊重贴包首",
      "risk_assessment": "低风险，按装裱规范执行",
      "approval_status": "SUBMITTED",
      "owner_id": 1
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_record_id": 4,
      "plan_title": "莲花底座裂缝处理方案",
      "method": "微晶蜡灌注填缝，随色做旧",
      "risk_assessment": "中风险，需先小面试色",
      "approval_status": "APPROVED",
      "owner_id": 2
    },
    {
      "id": 3,
      "relic_id": 1,
      "damage_record_id": 6,
      "plan_title": "瓶口磕伤补配方案（草稿）",
      "method": "树脂补配缺釉后随色罩釉",
      "risk_assessment": "中风险，釉色比对待定",
      "approval_status": "DRAFT",
      "owner_id": 1
    }
  ],
  "restorationStep": [
    {
      "id": 1,
      "plan_id": 1,
      "step_order": "1",
      "technique": "包首揭裱",
      "material_used": "小麦淀粉糨糊、绢料",
      "operator_id": 1,
      "step_status": "IN_PROGRESS",
      "finished_at": ""
    },
    {
      "id": 2,
      "plan_id": 2,
      "step_order": "1",
      "technique": "裂缝清理灌注",
      "material_used": "微晶蜡、着色剂",
      "operator_id": 2,
      "step_status": "DONE",
      "finished_at": "2026-09-09T17:00:00Z"
    },
    {
      "id": 3,
      "plan_id": 2,
      "step_order": "2",
      "technique": "表面随色做旧",
      "material_used": "矿物颜料",
      "operator_id": 2,
      "step_status": "DONE",
      "finished_at": "2026-09-10T16:30:00Z"
    }
  ],
  "imageVersion": [
    {
      "id": 1,
      "relic_id": 3,
      "plan_id": 1,
      "version_no": "v1",
      "image_type": "BEFORE",
      "file_path": "/mock/scroll-before.png",
      "capture_at": "2026-09-02T09:00:00Z",
      "note": "修复前轴头脱落"
    },
    {
      "id": 2,
      "relic_id": 2,
      "plan_id": 2,
      "version_no": "v1",
      "image_type": "BEFORE",
      "file_path": "/mock/buddha-base-before.png",
      "capture_at": "2026-09-06T09:30:00Z",
      "note": "底座裂缝特写"
    },
    {
      "id": 3,
      "relic_id": 2,
      "plan_id": 2,
      "version_no": "v2",
      "image_type": "AFTER",
      "file_path": "/mock/buddha-base-after.png",
      "capture_at": "2026-09-11T15:00:00Z",
      "note": "灌注随色完成"
    }
  ]
} as const;
