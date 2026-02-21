import os
import json
from google import genai
from pydantic import BaseModel

class ExtractedRuleSchema(BaseModel):
    rule_description: str
    logic: str
    raw_text_quote: str

class PolicyRulesResponseSchema(BaseModel):
    rules: list[ExtractedRuleSchema]

def extract_rules_from_text(policy_text: str, policy_name: str) -> dict:
    """
    Uses Gemini 2.5 Flash to automatically extract AML transaction rules from raw policy text.
    For HackFest-2.0, we use Structured Outputs to guarantee clean JSON rules.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Warning: GEMINI_API_KEY environment variable not set. Returning dummy schema.")
        return {
            "policy_name": policy_name,
            "rules": [
                {
                    "rule_description": "Dummy Rule",
                    "logic": "amount > 0",
                    "raw_text_quote": "Dummy Quote"
                }
            ]
        }
    
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are an expert Anti-Money Laundering (AML) Compliance AI Agent.
    Read the following Policy Document and extract the literal business rules that enforce transaction monitoring.
    
    Policy Name: {policy_name}
    
    Policy Document Text:
    {policy_text}
    
    Translate the rules into strict logic using standard comparison operators (>, <, >=, <=, ==, !=) on these column names:
    - Amount
    - Sender_Account
    - Receiver_Account
    - Time
    
    If the rule mentions rapid activity or multiple transactions, use logic like: 'COUNT(transaction_id) OVER 24h > 3'
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': PolicyRulesResponseSchema,
        },
    )
    
    parsed = json.loads(response.text)
    return {
        "policy_name": policy_name,
        "rules": parsed.get("rules", [])
    }
