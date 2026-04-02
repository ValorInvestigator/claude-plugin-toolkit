# Valor Letterhead -- Professional Letter Generator

Generate a professional .docx letter using Levi Bakke's Valor Investigations letterhead template.

## TEMPLATE SOURCE
The letterhead template is at: `C:\Users\Big Levi\OneDrive\Documents\Header Template.dotx`

## USAGE

When the user invokes `/letterhead`, ask for or parse from their message:
1. Who is this letter to?
2. What is the subject?
3. What should the letter say? (They may paste the full text or describe what they want)
4. Where should it be saved? (filename and folder)
5. Any attachments to reference?

## HOW IT WORKS

1. Parse the user's request for recipient, subject, body, output path, date
2. Run the generator script: `python ${CLAUDE_SKILL_DIR}/scripts/letterhead_generator.py`
3. Or read the script for the `create_letterhead_doc()` function signature and call it inline

For the full Python implementation, see [scripts/letterhead_generator.py](scripts/letterhead_generator.py).

## STYLE NOTES
- Professional but direct -- Levi's tone is authoritative, not deferential
- Cite specific laws/regulations when relevant (HIPAA, ORS, CFR, etc.)
- Include deadlines and consequences for non-compliance when appropriate
- Always include the contact email in the signature block
- Use Courier New 12pt throughout (matches the header template)

## INPUT
$ARGUMENTS -- The user may provide the letter content directly, or describe what they want and let you draft it.
