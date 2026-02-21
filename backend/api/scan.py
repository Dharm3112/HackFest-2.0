from fastapi import APIRouter
from backend.agents.db_scanner import scan_transactions_for_rules
from backend.database import get_db_connection

router = APIRouter()

@router.post("/api/scan/trigger")
def trigger_system_scan():
    """
    Manually triggers the Data Engine (DuckDB) to scan the optimized Parquet
    dataset against all currently active AI rules in the database.
    """
    total_found = scan_transactions_for_rules()
    return {"status": "success", "new_violations_found": total_found}

@router.get("/api/violations")
def get_violations():
    """
    Retrieves all flagged transactions for the Human-in-the-Loop dashboard.
    Joins the violations table with the rules table to provide explainability context.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            v.id, 
            v.transaction_id, 
            v.status, 
            v.ai_justification,
            r.policy_name,
            r.rule_json
        FROM violations v
        JOIN rules r ON v.rule_id = r.id
        ORDER BY v.id DESC
        LIMIT 100
    """)
    rows = cursor.fetchall()
    
    violations = []
    for row in rows:
        violations.append({
            "id": row["id"],
            "transaction_id": row["transaction_id"],
            "status": row["status"],
            "ai_justification": row["ai_justification"],
            "policy_name": row["policy_name"],
            "rule_overview": row["rule_json"]
        })
    conn.close()
    return violations

@router.post("/api/violations/{violation_id}/resolve")
def resolve_violation(violation_id: int, action: str):
    """
    Allows the human compliance officer to approve or escalate a single violation.
    action must be one of: 'approved', 'escalated'
    """
    if action not in ["approved", "escalated"]:
        return {"error": "Invalid action format."}
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE violations SET status = ? WHERE id = ?", (action, violation_id))
    conn.commit()
    conn.close()
    
    return {"status": "success", "violation_id": violation_id, "new_status": action}
