from pydantic import BaseModel
from typing import List, Optional

class RuleJSON(BaseModel):
    description: str
    logic: str # e.g. "Amount > 10000"

class RuleModel(BaseModel):
    policy_name: str
    rule_json: RuleJSON
    raw_text_quote: str

class ExtractedRulesResponse(BaseModel):
    policy_name: str
    rules: List[RuleModel]

class ViolationModel(BaseModel):
    transaction_id: str
    rule_id: int
    status: str
    ai_justification: str
