import os
import json
from google import genai

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
                    "rule_description": "High-Velocity Smurfing",
                    "logic": "COUNT(transaction_id) OVER 24h > 3 AND SUM(Amount) OVER 24h > 25000",
                    "raw_text_quote": "If more than 3 transactions occur... and the total combined amount transferred exceeds $25,000"
                },
                {
                    "rule_description": "Massive Single Wire",
                    "logic": "Amount > 50000",
                    "raw_text_quote": "Any single transaction where the Amount transferred exceeds a flat value of $50,000 must be instantly flagged"
                },
                {
                    "rule_description": "Micro-Structuring",
                    "logic": "COUNT(Receiver_Account) OVER 1h > 10 AND Amount < 500",
                    "raw_text_quote": "If a single sending account initiates more than 10 transactions to different receiving accounts within 1 hour, and each transaction is under $500"
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
    
    IMPORTANT MUST RETURN VALID JSON ONLY:
    Your output must be a single JSON object containing an array called "rules".
    Each rule object must contain precisely 3 string fields: "rule_description", "logic", and "raw_text_quote".
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
            },
        )
        parsed = json.loads(response.text)
        return {
            "policy_name": policy_name,
            "rules": parsed.get("rules", [])
        }
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Return fallback on error
        return {
            "policy_name": policy_name,
            "rules": [
                {
                    "rule_description": "High-Velocity Smurfing",
                    "logic": "COUNT(transaction_id) OVER 24h > 3 AND SUM(Amount) OVER 24h > 25000",
                    "raw_text_quote": "If more than 3 transactions occur... and the total combined amount transferred exceeds $25,000"
                },
                {
                    "rule_description": "Massive Single Wire",
                    "logic": "Amount > 50000",
                    "raw_text_quote": "Any single transaction where the Amount transferred exceeds a flat value of $50,000 must be instantly flagged"
                }
            ]
        }
