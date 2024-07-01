import os
import deepl
from dotenv import load_dotenv

load_dotenv()
auth_key = os.environ.get("DEEPL_KEY")
translator = deepl.Translator(auth_key)

# result = translator.translate_text("お元気ですか？", target_lang="EN-GB")
# print(result)

def deepl_translate(string):
    usage = translator.get_usage()
    if usage.any_limit_reached:
        print('Translation limit reached.')
        raise ValueError
    else:
        result = translator.translate_text(string, target_lang="EN-GB")
        print(f"Character usage: {usage.character}")
        return str(result)