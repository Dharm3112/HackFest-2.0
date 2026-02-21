from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.models.schemas import ExtractedRulesResponse, RuleModel, RuleJSON
from backend.agents.pdf_reader_agent import extract_rules_from_text
from backend.database import get_db_connection
import json

router = APIRouter()

@router.post("/api/policy/upload", response_model=ExtractedRulesResponse)
async def upload_policy(file: UploadFile = File(...)):
    """
    Ingests a raw text/PDF policy document, uses the AI Rule Extractor Agent,
    and saves the executable rules to the SQLite database.
    """
    try:
        content = await file.read()
        policy_text = content.decode("utf-8")
        policy_name = file.filename
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not read file. Ensure it is text decodable.")
    
    # 1. AI Rule Extraction
    extracted = extract_rules_from_text(policy_text, policy_name)
    rules_list = extracted.get("rules", [])
    
    # 2. Save to SQLite
    conn = get_db_connection()
    cursor = conn.cursor()
    saved_rules = []
    
    for r in rules_list:
        rule_logic = r.get("logic", "")
        rule_desc = r.get("rule_description", "")
        raw_quote = r.get("raw_text_quote", "")
        
        rule_json_str = json.dumps({"description": rule_desc, "logic": rule_logic})
        
        cursor.execute(
            "INSERT INTO rules (policy_name, rule_json, raw_text_quote) VALUES (?, ?, ?)",
            (policy_name, rule_json_str, raw_quote)
        )
        
        saved_rules.append(RuleModel(
            policy_name=policy_name,
            rule_json=RuleJSON(description=rule_desc, logic=rule_logic),
            raw_text_quote=raw_quote
        ))
        
    conn.commit()
    conn.close()
    
    return ExtractedRulesResponse(
        policy_name=policy_name,
        rules=saved_rules
    )

@router.get("/api/rules")
def get_rules():
    """Fetches all active rules from the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, policy_name, rule_json, raw_text_quote FROM rules")
    rows = cursor.fetchall()
    
    rules = []
    for row in rows:
        rules.append({
            "id": row["id"],
            "policy_name": row["policy_name"],
            "rule_json": json.loads(row["rule_json"]),
            "raw_text_quote": row["raw_text_quote"]
        })
    conn.close()
    return rules
