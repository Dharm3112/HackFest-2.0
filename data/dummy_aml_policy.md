# HexaCore Financial - Global Anti-Money Laundering (AML) Policy
**Effective Date:** January 1, 2026
**Version:** 4.2

## 1. Introduction
This policy outlines the strict monitoring guidelines HexaCore Financial enforces to detect and prevent money laundering activities. All transactions must be continuously evaluated against these rules, and flagged transactions must be held for review by the compliance team.

## 2. Core Transaction Monitoring Rules

The automated data policy agent must rigorously enforce the following scenarios across all transactional data:

### 2.1 The "High-Velocity Smurfing" Rule (Volume Evasion)
Money launderers often attempt to evade single-transaction reporting limits by breaking large sums into smaller, rapid-fire transactions across the same accounts.

**Policy Rule:** If more than **3 transactions** occur between the same sender (Account A) and the same receiver (Account B) within a time span of **24 hours**, and the total combined amount transferred exceeds **$25,000**, the activity MUST be flagged for "Smurfing Suspicion."

### 2.2 The "Massive Single Wire" Rule (Threshold Limit)
Extremely large, solitary cash or wire transfers present a disproportionately high risk for instant capital flight.

**Policy Rule:** Any single transaction where the `Amount` transferred exceeds a flat value of **$50,000** must be instantly flagged as "High-Value Transaction Risk," regardless of the account histories.

### 2.3 The "Micro-Structuring" Rule (Low Value Evasion)
To avoid standard alerts, launderers may use automated scripts to send thousands of tiny transfers.

**Policy Rule:** If a single sending account initiates more than **10 transactions** to *different* receiving accounts within **1 hour**, and each transaction is under **$500**, this must be flagged as "Micro-Structuring Activity."

## 3. Human Review & Remediation Protocol
Once flagged, transactions will remain in a `pending` state until a human compliance officer reviews the automated justification. The officer may then:
1. **Approve (False Alarm):** Unfreeze the funds if the activity is deemed legitimate business practice.
2. **Escalate (Investigate):** Place an administrative freeze on the account pending further KYC audits.

*(End of Document)*
