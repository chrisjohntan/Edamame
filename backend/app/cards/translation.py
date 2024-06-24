import os
import deepl
from dotenv import load_dotenv

load_dotenv()
auth_key = os.environ.get("DEEPL_KEY")
translator = deepl.Translator(auth_key)

# result = translator.translate_text("お元気ですか？", target_lang="EN-GB")
# print(result)